import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SEED_ACCOUNTS, SEED_ACTIVITY, SEED_BUSINESSES, SEED_PLANS, SEED_SETTINGS, DEMO_PASSWORD } from '../data/seed'

// Frontend stand-in for the platform API: every salon business, its branches,
// accounts, plans and platform settings. Persisted so changes made as one role
// show up when signing in as another.

const seed = () => ({
  businesses: SEED_BUSINESSES,
  plans: SEED_PLANS,
  accounts: SEED_ACCOUNTS,
  settings: SEED_SETTINGS,
  activity: SEED_ACTIVITY,
})

const id = prefix => `${prefix}-${crypto.randomUUID().slice(0, 8)}`
const today = () => new Date().toISOString().slice(0, 10)

export const usePlatform = create(persist(
  (set, get) => {
    const log = (type, text) => set(s => ({
      activity: [{ id: id('a'), type, text, at: new Date().toISOString() }, ...s.activity].slice(0, 50),
    }))
    const businessName = bid => get().businesses.find(b => b.id === bid)?.name
    const patchBusiness = (bid, fn) => set(s => ({ businesses: s.businesses.map(b => b.id === bid ? fn(b) : b) }))

    return {
      ...seed(),

      // ── Salon businesses (super admin) ──
      createBusiness(form) {
        const bid = id('b')
        const business = {
          id: bid, name: form.name, type: form.type, city: form.city, address: form.address, gstin: form.gstin,
          plan: form.plan, status: 'active', createdAt: today(), customers: 0, branches: [],
          owner: { name: form.ownerName, email: form.ownerEmail.toLowerCase(), phone: form.phone },
        }
        set(s => ({
          businesses: [business, ...s.businesses],
          accounts: [...s.accounts, { email: business.owner.email, name: form.ownerName, role: 'owner', title: 'Owner', businessId: bid, password: DEMO_PASSWORD }],
        }))
        log('create', `${form.name} was created by the platform team`)
        return bid
      },

      updateBusiness(bid, form) {
        const before = get().businesses.find(b => b.id === bid)
        patchBusiness(bid, b => ({
          ...b, name: form.name, type: form.type, city: form.city, address: form.address, gstin: form.gstin, plan: form.plan,
          owner: { ...b.owner, name: form.ownerName, email: form.ownerEmail.toLowerCase(), phone: form.phone },
        }))
        if (before.plan !== form.plan) log('plan', `${form.name} moved from ${planName(get, before.plan)} to ${planName(get, form.plan)}`)
        else log('edit', `${form.name} details were updated`)
      },

      changePlan(bid, planId) {
        const before = get().businesses.find(b => b.id === bid)
        if (before.plan === planId) return
        patchBusiness(bid, b => ({ ...b, plan: planId }))
        log('plan', `${before.name} moved from ${planName(get, before.plan)} to ${planName(get, planId)}`)
      },

      setStatus(bid, status, note = '') {
        patchBusiness(bid, b => ({ ...b, status, statusNote: note }))
        log('status', `${businessName(bid)} was ${{ active: 'activated', inactive: 'deactivated', suspended: 'suspended' }[status]}${note ? `: ${note}` : ''}`)
      },

      approve(bid) {
        patchBusiness(bid, b => ({ ...b, status: 'active', createdAt: today(), branches: b.branches.map(br => ({ ...br, status: 'active' })) }))
        log('approve', `${businessName(bid)} was approved and is now live`)
      },

      reject(bid, reason) {
        patchBusiness(bid, b => ({ ...b, status: 'rejected', statusNote: reason }))
        log('reject', `${businessName(bid)}'s registration was rejected${reason ? `: ${reason}` : ''}`)
      },

      recordAccess(bid) {
        log('access', `Platform team opened ${businessName(bid)}'s dashboard`)
      },

      deleteBusiness(bid) {
        const name = businessName(bid)
        set(s => ({
          businesses: s.businesses.filter(b => b.id !== bid),
          accounts: s.accounts.filter(a => a.businessId !== bid),
        }))
        log('delete', `${name} was deleted`)
      },

      // Self-registration from the public sign-up page.
      registerBusiness(form) {
        const { requireApproval } = get().settings
        const bid = id('b')
        const email = form.email.trim().toLowerCase()
        const business = {
          id: bid, name: form.businessName.trim(), type: form.businessType, city: form.city.trim(), address: form.city.trim(),
          gstin: '', plan: 'starter', status: requireApproval ? 'pending' : 'active', createdAt: today(), customers: 0, branches: [],
          owner: { name: form.name.trim(), email, phone: form.phone },
        }
        set(s => ({
          businesses: [business, ...s.businesses],
          accounts: [...s.accounts, { email, name: form.name.trim(), role: 'owner', title: 'Owner', businessId: bid, password: form.password }],
        }))
        log('request', requireApproval ? `${business.name} submitted a registration request` : `${business.name} signed up`)
        return business
      },

      // ── Branches (salon owner) ──
      addBranch(bid, form) {
        const branchId = id('br')
        const managerEmail = form.managerEmail.trim().toLowerCase()
        const branch = {
          id: branchId, name: form.name.trim(), city: form.city.trim(), address: form.address.trim(), phone: form.phone,
          manager: { name: form.managerName.trim(), email: managerEmail },
          staff: 0, revenueMonth: 0, appointmentsMonth: 0, rating: 0, growth: 0,
          status: 'active', hours: '10:00 AM – 9:00 PM', onlineBooking: true,
        }
        patchBusiness(bid, b => ({ ...b, branches: [...b.branches, branch] }))
        set(s => ({
          accounts: s.accounts.some(a => a.email === managerEmail)
            ? s.accounts.map(a => a.email === managerEmail ? { ...a, branchIds: [...(a.branchIds || []), branchId] } : a)
            : [...s.accounts, { email: managerEmail, name: branch.manager.name, role: 'manager', title: 'Branch Manager', businessId: bid, branchIds: [branchId], password: DEMO_PASSWORD }],
        }))
        log('branch', `${businessName(bid)} opened a new branch in ${branch.name}`)
        return branchId
      },

      updateBranch(bid, branchId, patch) {
        patchBusiness(bid, b => ({ ...b, branches: b.branches.map(br => br.id === branchId ? { ...br, ...patch } : br) }))
      },

      setBranchAccess(email, branchId, granted) {
        set(s => ({
          accounts: s.accounts.map(a => a.email !== email ? a : {
            ...a,
            branchIds: granted ? [...new Set([...(a.branchIds || []), branchId])] : (a.branchIds || []).filter(x => x !== branchId),
          }),
        }))
      },

      // ── Plans & settings ──
      savePlan(plan) {
        const exists = get().plans.some(p => p.id === plan.id)
        set(s => ({ plans: exists ? s.plans.map(p => p.id === plan.id ? plan : p) : [...s.plans, { ...plan, id: id('plan') }] }))
        log('plan', exists ? `Plan "${plan.name}" was updated` : `New plan "${plan.name}" was created`)
      },

      togglePlan(planId) {
        set(s => ({ plans: s.plans.map(p => p.id === planId ? { ...p, active: !p.active } : p) }))
      },

      updateSettings(patch) {
        set(s => ({ settings: { ...s.settings, ...patch } }))
        log('settings', 'Platform settings were updated')
      },

      resetDemoData() { set(seed()) },
    }
  },
  { name: 'keeng-platform', version: 1, storage: createJSONStorage(() => localStorage) },
))

function planName(get, planId) {
  return get().plans.find(p => p.id === planId)?.name || planId
}

export const planPrice = (plans, planId) => plans.find(p => p.id === planId)?.price || 0
