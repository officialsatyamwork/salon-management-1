import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { usePlatform } from './platform'

// Frontend-only session until the auth API is wired in. `login` is the only
// function that needs to change when it is.

export const ROLES = {
  'super-admin': { label: 'Super Admin', color: '#c9973a' },
  owner: { label: 'Salon Owner', color: '#c4607a' },
  manager: { label: 'Branch Manager', color: '#0891b2' },
  employee: { label: 'Employee', color: '#059669' },
}

export const ROLE_MODULES = {
  'super-admin': ['dashboard', 'salons', 'plans', 'platform-settings', 'settings'],
  owner: [
    'dashboard', 'appointments', 'calendar', 'customers', 'billing', 'staff', 'services',
    'inventory', 'membership', 'marketing', 'reports', 'branches', 'settings',
  ],
  manager: ['dashboard', 'appointments', 'calendar', 'customers', 'staff', 'services', 'inventory', 'reports', 'settings'],
  employee: ['dashboard', 'appointments', 'settings'],
}

// Shown as one-tap chips on the login page.
export const DEMO_LOGINS = [
  { email: 'superadmin@keeng.in', label: 'Super Admin', role: 'super-admin' },
  { email: 'owner@glowsalon.in', label: 'Master Admin', role: 'owner' },
  { email: 'owner@urbanglam.in', label: 'Owner', role: 'owner' },
  { email: 'manager@glowsalon.in', label: 'Branch Manager', role: 'manager' },
  { email: 'employee@glowsalon.in', label: 'Employee', role: 'employee' },
]

const BLOCKED = {
  pending: 'Your salon registration is waiting for approval. We will email you once it is approved.',
  rejected: 'Your salon registration was not approved. Contact support for details.',
  suspended: 'This salon account is suspended. Contact Keeng support to restore access.',
  inactive: 'This salon account has been deactivated. Contact Keeng support to reactivate it.',
}

const wait = ms => new Promise(r => setTimeout(r, ms))
const sessionUser = ({ password: _password, branchIds: _branchIds, ...account }) => account

export const useAuth = create(persist(
  (set, get) => ({
    user: null,
    impersonator: null,

    async login(email, password) {
      await wait(600)
      const { accounts, businesses } = usePlatform.getState()
      const account = accounts.find(a => a.email === email.trim().toLowerCase())
      if (!account || account.password !== password) throw new Error('Invalid email or password')
      if (account.businessId) {
        const status = businesses.find(b => b.id === account.businessId)?.status
        if (!status) throw new Error('This salon account no longer exists.')
        if (BLOCKED[status]) throw new Error(BLOCKED[status])
      }
      set({ user: sessionUser(account), impersonator: null })
    },

    logout() { set({ user: null, impersonator: null }) },

    // Super admin opens a salon's dashboard as its owner.
    impersonate(business) {
      const { user } = get()
      if (user?.role !== 'super-admin') return
      set({
        impersonator: user,
        user: { email: business.owner.email, name: business.owner.name, role: 'owner', title: 'Owner', businessId: business.id },
      })
    },

    stopImpersonating() {
      const { impersonator } = get()
      if (impersonator) set({ user: impersonator, impersonator: null })
    },

    can(module) {
      const role = get().user?.role
      return !!ROLE_MODULES[role]?.includes(module)
    },
  }),
  {
    name: 'keeng-session',
    version: 2,
    migrate: () => ({ user: null, impersonator: null }),
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({ user: s.user, impersonator: s.impersonator }),
  },
))

// The signed-in user's business and the branches they may open.
export function useScope() {
  const user = useAuth(s => s.user)
  const business = usePlatform(s => s.businesses.find(b => b.id === user?.businessId))
  const account = usePlatform(s => s.accounts.find(a => a.email === user?.email))
  const branchIds = account?.branchIds || []
  const branches = !business ? []
    : user.role === 'owner' ? business.branches
      : business.branches.filter(b => branchIds.includes(b.id))
  return { user, business, branches }
}

export const initials = name => name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()
