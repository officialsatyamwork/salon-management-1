import { useState } from 'react'
import { Plus, Check, Pencil, GitBranch, Users, MessageSquare } from 'lucide-react'
import { usePlatform } from '../../store/platform'
import { Panel, Meter } from '../../components/dashboard/widgets'
import { inr } from '../../components/dashboard/chart'
import { Modal, Field, TextInput, Toggle, ModalActions } from '../../components/ui/Modal'

const EMPTY = { name: '', price: '', maxBranches: '', maxStaff: '', smsCredits: '', description: '', features: '', popular: false, active: true }

function PlanModal({ plan, onClose }) {
  const savePlan = usePlatform(s => s.savePlan)
  const [form, setForm] = useState(() => plan ? { ...plan, features: plan.features.join('\n') } : EMPTY)
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }
  const num = k => e => set(k, e.target.value.replace(/\D/g, ''))

  const submit = ev => {
    ev.preventDefault()
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    for (const k of ['price', 'maxBranches', 'maxStaff', 'smsCredits']) if (form[k] === '') e[k] = 'Required'
    if (Object.keys(e).length) { setErrors(e); return }
    savePlan({
      ...form, name: form.name.trim(), description: form.description.trim(),
      price: +form.price, maxBranches: +form.maxBranches, maxStaff: +form.maxStaff, smsCredits: +form.smsCredits,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <Modal title={plan ? `Edit ${plan.name}` : 'New subscription plan'} subtitle="Salons already on this plan get the new limits immediately." width="max-w-lg" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Plan name" error={errors.name}><TextInput value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} autoFocus /></Field>
          <Field label="Price (₹ / month)" error={errors.price}><TextInput inputMode="numeric" value={form.price} onChange={num('price')} error={errors.price} /></Field>
          <Field label="Branches allowed" error={errors.maxBranches}><TextInput inputMode="numeric" value={form.maxBranches} onChange={num('maxBranches')} error={errors.maxBranches} /></Field>
          <Field label="Staff seats" error={errors.maxStaff}><TextInput inputMode="numeric" value={form.maxStaff} onChange={num('maxStaff')} error={errors.maxStaff} /></Field>
          <Field label="SMS credits / month" error={errors.smsCredits}><TextInput inputMode="numeric" value={form.smsCredits} onChange={num('smsCredits')} error={errors.smsCredits} /></Field>
          <Field label="Short description"><TextInput value={form.description} onChange={e => set('description', e.target.value)} /></Field>
        </div>
        <Field label="Features" hint="One per line">
          <textarea value={form.features} onChange={e => set('features', e.target.value)} rows={4}
            className="w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500 resize-none" />
        </Field>
        <div className="flex items-center justify-between gap-3 py-1">
          <span className="text-sm text-fg-2">Highlight as “Most popular”</span>
          <Toggle checked={form.popular} onChange={v => set('popular', v)} label="Most popular" />
        </div>
        <ModalActions onCancel={onClose} submitLabel={plan ? 'Save plan' : 'Create plan'} />
      </form>
    </Modal>
  )
}

export default function PlansPage() {
  const plans = usePlatform(s => s.plans)
  const businesses = usePlatform(s => s.businesses)
  const togglePlan = usePlatform(s => s.togglePlan)
  const [editing, setEditing] = useState(null)

  const active = businesses.filter(b => b.status === 'active')
  const rows = plans.map(p => {
    const salons = active.filter(b => b.plan === p.id).length
    return { ...p, salons, mrr: salons * p.price }
  })
  const totalMrr = rows.reduce((s, r) => s + r.mrr, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-fg">Subscription plans</h2>
          <p className="text-[13px] text-fg-muted">What salons pay and what each plan allows. {inr.format(totalMrr)} billed every month.</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary px-4 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
          <Plus size={15} /> New plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {rows.map(p => (
          <div key={p.id} className={`glass-card rounded-2xl p-5 flex flex-col ${p.active ? '' : 'opacity-60'}`}
            style={p.popular ? { borderColor: 'var(--border-brand)' } : undefined}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-[16px] font-bold text-fg" style={{ fontFamily: 'Inter, sans-serif' }}>{p.name}</h3>
              {p.popular && <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>Most popular</span>}
            </div>
            <p className="text-[12.5px] text-fg-muted min-h-[36px]">{p.description}</p>
            <p className="mt-3 mb-4"><span className="text-[26px] font-bold text-fg">{inr.format(p.price)}</span><span className="text-[13px] text-fg-muted"> /month</span></p>

            <ul className="space-y-1.5 text-[12.5px] text-fg-2 mb-4">
              <li className="flex items-center gap-2"><GitBranch size={13} className="text-fg-muted" />{p.maxBranches} branch{p.maxBranches > 1 ? 'es' : ''}</li>
              <li className="flex items-center gap-2"><Users size={13} className="text-fg-muted" />{p.maxStaff} staff seats</li>
              <li className="flex items-center gap-2"><MessageSquare size={13} className="text-fg-muted" />{p.smsCredits.toLocaleString('en-IN')} SMS / month</li>
            </ul>
            <ul className="space-y-1.5 text-[12.5px] text-fg mb-5 flex-1">
              {p.features.map(f => <li key={f} className="flex gap-2"><Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />{f}</li>)}
            </ul>

            <div className="rounded-xl p-3 bg-fg/[0.04] border border-line mb-4 text-[12.5px] flex justify-between">
              <span className="text-fg-2">{p.salons} salon{p.salons === 1 ? '' : 's'}</span>
              <span className="font-semibold text-fg">{inr.format(p.mrr)}/mo</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[12.5px] text-fg-2">
                <Toggle checked={p.active} onChange={() => togglePlan(p.id)} label={`${p.name} available`} />
                {p.active ? 'Available' : 'Hidden'}
              </span>
              <button onClick={() => setEditing(p)} className="btn-ghost px-3 py-1.5 rounded-lg text-[12.5px] font-medium flex items-center gap-1.5">
                <Pencil size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Subscription revenue by plan" subtitle="Active salons only" delay={0.1}>
        <ul className="space-y-4">
          {rows.map(r => (
            <li key={r.id}>
              <div className="flex justify-between text-[13px] mb-1.5">
                <span className="text-fg font-medium">{r.name} <span className="text-fg-muted font-normal">· {r.salons} × {inr.format(r.price)}</span></span>
                <span className="font-semibold text-fg">{inr.format(r.mrr)} <span className="text-fg-muted font-normal">({totalMrr ? Math.round(r.mrr / totalMrr * 100) : 0}%)</span></span>
              </div>
              <Meter value={r.mrr} max={Math.max(1, totalMrr)} tone="gold" />
            </li>
          ))}
        </ul>
      </Panel>

      {editing && <PlanModal plan={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  )
}
