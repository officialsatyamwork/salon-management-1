import { useState } from 'react'
import { Modal, Field, TextInput, Select, ModalActions } from '../ui/Modal'
import { usePlatform } from '../../store/platform'
import { DEMO_PASSWORD, BIZ_TYPES } from '../../data/seed'

const fromBusiness = b => b ? {
  name: b.name, type: b.type, ownerName: b.owner.name, ownerEmail: b.owner.email, phone: b.owner.phone,
  city: b.city, address: b.address, gstin: b.gstin || '', plan: b.plan,
} : { name: '', type: 'Salon', ownerName: '', ownerEmail: '', phone: '', city: '', address: '', gstin: '', plan: 'starter' }

export default function SalonFormModal({ business, onSaved, onClose }) {
  const plans = usePlatform(s => s.plans)
  const accounts = usePlatform(s => s.accounts)
  const createBusiness = usePlatform(s => s.createBusiness)
  const updateBusiness = usePlatform(s => s.updateBusiness)
  const [form, setForm] = useState(() => fromBusiness(business))
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.ownerName.trim()) e.ownerName = 'Required'
    if (!/\S+@\S+\.\S+/.test(form.ownerEmail)) e.ownerEmail = 'Enter a valid email'
    else if (!business && accounts.some(a => a.email === form.ownerEmail.trim().toLowerCase())) e.ownerEmail = 'This email already has an account'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a 10-digit number'
    if (!form.city.trim()) e.city = 'Required'
    if (form.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(form.gstin)) e.gstin = 'Not a valid GSTIN'
    return e
  }

  const submit = ev => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const clean = { ...form, name: form.name.trim(), ownerName: form.ownerName.trim(), ownerEmail: form.ownerEmail.trim(), city: form.city.trim(), address: form.address.trim() || form.city.trim() }
    if (business) updateBusiness(business.id, clean)
    const id = business ? business.id : createBusiness(clean)
    onSaved?.(id)
    onClose()
  }

  return (
    <Modal title={business ? `Edit ${business.name}` : 'Create salon business'} width="max-w-xl"
      subtitle={business ? 'Changes apply immediately for the salon owner.' : `The owner can sign in with the temporary password ${DEMO_PASSWORD}.`}
      onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Business name" error={errors.name}>
            <TextInput value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} placeholder="e.g. Glow Salon" autoFocus />
          </Field>
          <Field label="Business type">
            <Select value={form.type} onChange={e => set('type', e.target.value)}>
              {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Owner name" error={errors.ownerName}>
            <TextInput value={form.ownerName} onChange={e => set('ownerName', e.target.value)} error={errors.ownerName} placeholder="Full name" />
          </Field>
          <Field label="Owner email" error={errors.ownerEmail}>
            <TextInput type="email" value={form.ownerEmail} onChange={e => set('ownerEmail', e.target.value)} error={errors.ownerEmail} placeholder="owner@salon.in" />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <TextInput value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="10-digit number" />
          </Field>
          <Field label="City" error={errors.city}>
            <TextInput value={form.city} onChange={e => set('city', e.target.value)} error={errors.city} placeholder="e.g. Hyderabad" />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <TextInput value={form.address} onChange={e => set('address', e.target.value)} placeholder="Head office address" />
          </Field>
          <Field label="GSTIN (optional)" error={errors.gstin}>
            <TextInput value={form.gstin} onChange={e => set('gstin', e.target.value.toUpperCase())} error={errors.gstin} placeholder="15 characters" />
          </Field>
          <Field label="Subscription plan">
            <Select value={form.plan} onChange={e => set('plan', e.target.value)}>
              {plans.filter(p => p.active || p.id === form.plan).map(p => (
                <option key={p.id} value={p.id}>{p.name} · ₹{p.price.toLocaleString('en-IN')}/mo · {p.maxBranches} branch{p.maxBranches > 1 ? 'es' : ''}</option>
              ))}
            </Select>
          </Field>
        </div>
        <ModalActions onCancel={onClose} submitLabel={business ? 'Save changes' : 'Create salon'} />
      </form>
    </Modal>
  )
}
