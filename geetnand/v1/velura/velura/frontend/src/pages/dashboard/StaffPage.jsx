import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Phone, Star, Users, Wallet, Clock, CheckCircle2, Percent } from 'lucide-react'
import { BRANCH_STAFF } from '../../data/branchOps'
import { TONES, inr } from '../../components/dashboard/chart'
import { Modal, Field, TextInput, Select, ModalActions } from '../../components/ui/Modal'

const ROLES = ['Senior Stylist', 'Stylist', 'Skin Specialist', 'Nail Technician', 'Massage Therapist', 'Receptionist']
const RATES = [0, 5, 8, 10, 12, 15, 18, 20]
const EMPTY = { name: '', role: '', phone: '', email: '', commissionRate: '10' }

const earned = s => Math.round(s.revenue * s.commissionRate / 100)
const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

function PayoutBadge({ status }) {
  if (status === 'none') return <span className="text-[12px] text-fg-muted">Fixed salary</span>
  const paid = status === 'paid'
  const color = paid ? TONES.green : TONES.amber
  return (
    <span className="badge" style={{ background: `${color}1f`, color }}>
      {paid ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
      {paid ? 'Paid' : 'Pending'}
    </span>
  )
}

function AddStaffModal({ onAdd, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const submit = ev => {
    ev.preventDefault()
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.role) e.role = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a 10-digit number'
    if (Object.keys(e).length) { setErrors(e); return }
    const rate = form.role === 'Receptionist' ? 0 : +form.commissionRate
    onAdd({
      ...form, id: `s-${Date.now()}`, name: form.name.trim(), commissionRate: rate,
      services: [], appointments: 0, revenue: 0, rating: 0, tone: 'violet', status: 'active',
      payout: rate ? 'pending' : 'none',
    })
    onClose()
  }

  return (
    <Modal title="Add staff member" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" error={errors.name}><TextInput value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} placeholder="Staff name" autoFocus /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" error={errors.phone}><TextInput value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="10-digit number" /></Field>
          <Field label="Email"><TextInput type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="staff@salon.in" /></Field>
          <Field label="Role" error={errors.role}>
            <Select value={form.role} onChange={e => set('role', e.target.value)} error={errors.role}>
              <option value="">Select role</option>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Commission" hint={form.role === 'Receptionist' ? 'Front desk is on fixed salary' : 'Share of service revenue'}>
            <Select value={form.role === 'Receptionist' ? '0' : form.commissionRate} disabled={form.role === 'Receptionist'}
              onChange={e => set('commissionRate', e.target.value)}>
              {RATES.map(r => <option key={r} value={r}>{r}%</option>)}
            </Select>
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel="Add staff" />
      </form>
    </Modal>
  )
}

export default function StaffPage() {
  const [staff, setStaff] = useState(BRANCH_STAFF)
  const [tab, setTab] = useState('team')
  const [adding, setAdding] = useState(false)

  const patch = (id, changes) => setStaff(list => list.map(s => s.id === id ? { ...s, ...changes } : s))
  const onCommission = staff.filter(s => s.commissionRate > 0)
  const totalCommission = onCommission.reduce((t, s) => t + earned(s), 0)
  const pending = onCommission.filter(s => s.payout === 'pending')
  const pendingAmount = pending.reduce((t, s) => t + earned(s), 0)
  const payAll = () => setStaff(list => list.map(s => s.payout === 'pending' ? { ...s, payout: 'paid' } : s))

  const stats = [
    { icon: Users, label: 'Team members', value: staff.length, tone: 'violet' },
    { icon: Percent, label: 'Avg. commission rate', value: `${onCommission.length ? Math.round(onCommission.reduce((t, s) => t + s.commissionRate, 0) / onCommission.length) : 0}%`, tone: 'cyan' },
    { icon: Wallet, label: `Commission · ${month}`, value: inr.format(totalCommission), tone: 'gold' },
    { icon: Clock, label: 'Pending payout', value: inr.format(pendingAmount), tone: 'amber' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${TONES[s.tone]}1f`, color: TONES[s.tone] }}>
              <s.icon size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black text-fg leading-tight">{s.value}</p>
              <p className="text-fg-2 text-xs truncate">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex p-1 rounded-xl bg-fg/5">
          {[['team', 'Team'], ['commission', 'Commission']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === k ? 'bg-violet-600 text-white' : 'text-fg-2 hover:text-fg'}`}>
              {label}
            </button>
          ))}
        </div>
        {tab === 'team' ? (
          <button onClick={() => setAdding(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Staff
          </button>
        ) : (
          <button onClick={payAll} disabled={!pending.length}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <CheckCircle2 size={16} /> Pay all pending {pending.length > 0 && `(${inr.format(pendingAmount)})`}
          </button>
        )}
      </div>

      {tab === 'team' ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ background: `${TONES[s.tone]}26`, color: TONES[s.tone] }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg">{s.name}</h3>
                    <p className="text-xs" style={{ color: TONES[s.tone] }}>{s.role}</p>
                  </div>
                </div>
                <span className="bg-green-500/15 text-green-400 text-xs px-2 py-1 rounded-full">Active</span>
              </div>

              <div className="flex items-center gap-1 text-fg-2 text-sm mb-3"><Phone size={12} /> {s.phone}</div>

              {s.services.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.services.map(sv => <span key={sv} className="bg-fg/5 text-fg-2 text-xs px-2 py-0.5 rounded-full">{sv}</span>)}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line mt-auto">
                <div className="text-center">
                  <p className="text-fg font-bold text-sm">{s.appointments}</p>
                  <p className="text-fg-muted text-xs">Services</p>
                </div>
                <div className="text-center">
                  <p className="text-fg font-bold text-sm">{s.revenue ? `₹${(s.revenue / 1000).toFixed(1)}k` : '—'}</p>
                  <p className="text-fg-muted text-xs">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-sm flex items-center justify-center gap-0.5">
                    {s.rating > 0 ? <><Star size={10} className="fill-yellow-400" /> {s.rating}</> : '—'}
                  </p>
                  <p className="text-fg-muted text-xs">Rating</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl px-3 py-2 bg-fg/[0.04] text-[12.5px]">
                <span className="text-fg-2 flex items-center gap-1.5"><Wallet size={13} />
                  {s.commissionRate ? `${s.commissionRate}% commission` : 'Fixed salary'}
                </span>
                {s.commissionRate > 0 && <span className="font-semibold text-fg">{inr.format(earned(s))}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[760px] whitespace-nowrap data-table">
            <thead><tr>
              <th className="text-left">Staff</th><th className="text-right">Services</th><th className="text-right">Service revenue</th>
              <th className="text-left">Rate</th><th className="text-right">Commission</th><th className="text-left">Payout</th><th />
            </tr></thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td>
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px]" style={{ background: `${TONES[s.tone]}26`, color: TONES[s.tone] }}>{s.name[0]}</span>
                      <span><span className="block font-medium">{s.name}</span><span className="block text-[11.5px] text-fg-muted">{s.role}</span></span>
                    </span>
                  </td>
                  <td className="text-right text-fg-2">{s.appointments}</td>
                  <td className="text-right text-fg-2">{s.revenue ? inr.format(s.revenue) : '—'}</td>
                  <td>
                    {s.role === 'Receptionist' ? <span className="text-fg-muted">—</span> : (
                      <select value={s.commissionRate} aria-label={`Commission rate for ${s.name}`}
                        onChange={e => { const rate = +e.target.value; patch(s.id, { commissionRate: rate, payout: rate ? (s.payout === 'none' ? 'pending' : s.payout) : 'none' }) }}
                        className="bg-fg/5 border border-line rounded-lg px-2 py-1 text-[13px] text-fg focus:outline-none focus:border-violet-500">
                        {RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    )}
                  </td>
                  <td className="text-right font-semibold">{s.commissionRate ? inr.format(earned(s)) : '—'}</td>
                  <td><PayoutBadge status={s.payout} /></td>
                  <td className="text-right">
                    {s.payout === 'pending' && (
                      <button onClick={() => patch(s.id, { payout: 'paid' })}
                        className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg border border-line text-fg-2 hover:text-fg hover:bg-fg/5 transition-colors">
                        Mark paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="font-semibold">Total · {month}</td>
                <td className="text-right font-semibold">{staff.reduce((t, s) => t + s.appointments, 0)}</td>
                <td className="text-right font-semibold">{inr.format(staff.reduce((t, s) => t + s.revenue, 0))}</td>
                <td />
                <td className="text-right font-bold">{inr.format(totalCommission)}</td>
                <td colSpan={2} className="text-fg-muted text-[12.5px]">{pending.length ? `${inr.format(pendingAmount)} still to pay` : 'All paid'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {adding && <AddStaffModal onAdd={s => setStaff(list => [s, ...list])} onClose={() => setAdding(false)} />}
    </div>
  )
}
