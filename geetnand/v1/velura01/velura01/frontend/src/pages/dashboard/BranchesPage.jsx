import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, MapPin, Phone, Users, TrendingUp, UserRound, ArrowRight, PauseCircle, Power, Crown } from 'lucide-react'
import { useScope } from '../../store/auth'
import { usePlatform } from '../../store/platform'
import { StatusPill } from '../../components/dashboard/widgets'
import { lakh } from '../../components/dashboard/chart'
import { Modal, Field, TextInput, ModalActions } from '../../components/ui/Modal'
import { DEMO_PASSWORD } from '../../data/seed'

const EMPTY = { name: '', city: '', address: '', phone: '', managerName: '', managerEmail: '' }

function AddBranchModal({ business, onClose }) {
  const addBranch = usePlatform(s => s.addBranch)
  const accounts = usePlatform(s => s.accounts)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const submit = ev => {
    ev.preventDefault()
    const e = {}
    for (const k of ['name', 'city', 'address', 'managerName']) if (!form[k].trim()) e[k] = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a 10-digit number'
    const email = form.managerEmail.trim().toLowerCase()
    const existing = accounts.find(a => a.email === email)
    if (!/\S+@\S+\.\S+/.test(email)) e.managerEmail = 'Enter a valid email'
    else if (existing && (existing.businessId !== business.id || existing.role !== 'manager')) e.managerEmail = 'This email belongs to another account'
    if (Object.keys(e).length) { setErrors(e); return }
    addBranch(business.id, form)
    onClose()
  }

  const fields = [
    ['name', 'Branch name', 'e.g. Hyderabad or Jubilee Hills'], ['city', 'City', 'e.g. Hyderabad'],
    ['address', 'Address', 'Street and area'], ['phone', 'Branch phone', '10-digit number'],
  ]

  return (
    <Modal title="Add branch" subtitle={`New managers sign in with the temporary password ${DEMO_PASSWORD}.`} width="max-w-lg" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map(([k, label, ph]) => (
            <Field key={k} label={label} error={errors[k]} className={k === 'address' ? 'sm:col-span-2' : ''}>
              <TextInput value={form[k]} error={errors[k]} placeholder={ph}
                onChange={e => set(k, k === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value)} />
            </Field>
          ))}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-fg-muted pt-1">Branch manager</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Manager name" error={errors.managerName}>
            <TextInput value={form.managerName} error={errors.managerName} onChange={e => set('managerName', e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Manager email" error={errors.managerEmail} hint="An existing manager can run more than one branch.">
            <TextInput type="email" value={form.managerEmail} error={errors.managerEmail} onChange={e => set('managerEmail', e.target.value)} placeholder="manager@salon.in" />
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel="Add branch" />
      </form>
    </Modal>
  )
}

export default function BranchesPage() {
  const { business } = useScope()
  const plans = usePlatform(s => s.plans)
  const updateBranch = usePlatform(s => s.updateBranch)
  const [params] = useSearchParams()
  const [adding, setAdding] = useState(params.get('new') === '1')

  const plan = plans.find(p => p.id === business.plan)
  const branches = business.branches
  const atLimit = branches.length >= (plan?.maxBranches || 0)
  const totalRevenue = branches.reduce((s, b) => s + b.revenueMonth, 0)
  const totalStaff = branches.reduce((s, b) => s + b.staff, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {[
            { label: `Branches (${plan?.name} allows ${plan?.maxBranches})`, value: branches.length },
            { label: 'Total staff', value: totalStaff },
            { label: 'Revenue this month', value: lakh(totalRevenue) },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl px-4 sm:px-5 py-3">
              <p className="text-xl font-black text-fg">{s.value}</p>
              <p className="text-fg-2 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setAdding(true)} disabled={atLimit}
          title={atLimit ? 'Upgrade your plan to add more branches' : undefined}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Branch
        </button>
      </div>

      {atLimit && (
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3" style={{ borderColor: 'rgba(201,151,58,0.35)' }}>
          <Crown size={18} className="flex-shrink-0" style={{ color: '#c9973a' }} />
          <p className="flex-1 min-w-[200px] text-[13px] text-fg">
            You're using all {plan?.maxBranches} branch{plan?.maxBranches > 1 ? 'es' : ''} on the {plan?.name} plan. Upgrade to open more locations.
          </p>
          <Link to="/pricing" className="btn-primary px-3.5 py-2 rounded-xl text-[13px]">See plans</Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map(b => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-5 flex flex-col ${b.status !== 'active' ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="font-bold text-fg">{business.name} · {b.name}</h3>
                <div className="flex items-center gap-1 text-fg-2 text-xs mt-1">
                  <MapPin size={11} className="flex-shrink-0" /> <span className="truncate">{b.address}, {b.city}</span>
                </div>
              </div>
              <StatusPill status={b.status} />
            </div>

            <div className="space-y-1.5 text-sm text-fg-2 mb-4">
              <p className="flex items-center gap-1.5"><UserRound size={12} /> {b.manager.name} <span className="text-fg-muted">· manager</span></p>
              <p className="flex items-center gap-1.5"><Phone size={12} /> {b.phone}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-line mb-4">
              <div className="text-center">
                <p className="flex items-center justify-center gap-1 text-fg font-bold text-sm"><Users size={12} className="text-violet-400" /> {b.staff}</p>
                <p className="text-fg-muted text-xs">Staff</p>
              </div>
              <div className="text-center">
                <p className="text-fg font-bold text-sm">{b.appointmentsMonth}</p>
                <p className="text-fg-muted text-xs">Appts / mo</p>
              </div>
              <div className="text-center">
                <p className="flex items-center justify-center gap-1 text-fg font-bold text-sm"><TrendingUp size={12} className="text-green-400" /> {b.revenueMonth ? lakh(b.revenueMonth) : '—'}</p>
                <p className="text-fg-muted text-xs">Revenue</p>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              <Link to={`/dashboard/branches/${b.id}`}
                className="flex-1 btn-ghost py-2 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5">
                Open dashboard <ArrowRight size={14} />
              </Link>
              <button onClick={() => updateBranch(business.id, b.id, { status: b.status === 'active' ? 'inactive' : 'active' })}
                aria-label={b.status === 'active' ? `Pause ${b.name}` : `Reactivate ${b.name}`}
                title={b.status === 'active' ? 'Pause branch' : 'Reactivate branch'}
                className="w-10 rounded-xl border border-line flex items-center justify-center text-fg-muted hover:text-fg hover:bg-fg/5 transition-colors">
                {b.status === 'active' ? <PauseCircle size={16} /> : <Power size={16} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="glass rounded-2xl py-14 text-center">
          <p className="text-[14px] font-semibold text-fg">No branches yet</p>
          <p className="text-[12.5px] text-fg-muted">Add your first location to get a branch dashboard.</p>
        </div>
      )}

      {adding && <AddBranchModal business={business} onClose={() => setAdding(false)} />}
    </div>
  )
}
