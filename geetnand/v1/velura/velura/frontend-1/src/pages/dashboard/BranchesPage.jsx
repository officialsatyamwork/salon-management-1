import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, MapPin, Phone, Users, TrendingUp, Loader2, Power } from 'lucide-react'
import { del, get, patch, post } from '../../lib/api'
import { useAuth } from '../../store/auth'

const emptyForm = { name: '', city: '', address: '', phone: '' }

export default function BranchesPage() {
  const user = useAuth(s => s.user)
  const bootstrap = useAuth(s => s.bootstrap)
  const isOwner = user?.role === 'master_admin'
  const [branches, setBranches] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoadError('')
    get('/salons').then(setBranches).catch(e => setLoadError(e.message))
  }, [])
  useEffect(load, [load])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Invalid phone'
    return e
  }

  const close = () => { setShowModal(false); setErrors({}); setFormError(''); setForm(emptyForm) }

  const handleAdd = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true); setFormError('')
    try {
      const created = await post('/salons', form)
      setBranches(b => [...(b || []), created])
      close()
      bootstrap() // refresh the salon list used by the switcher
    } catch (err) {
      setFormError(err.message); setErrors(err.fields)
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (b) => {
    try {
      const updated = b.status === 'active'
        ? (await del(`/salons/${b.id}`), { ...b, status: 'inactive' })
        : await patch(`/salons/${b.id}`, { status: 'active' })
      setBranches(list => list.map(x => x.id === b.id ? { ...x, ...updated } : x))
    } catch (err) {
      setLoadError(err.message)
    }
  }

  if (!branches && !loadError) {
    return <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{[0, 1, 2].map(i => <div key={i} className="glass rounded-2xl h-44 animate-pulse" />)}</div>
  }

  const list = branches || []
  const showRevenue = list.some(b => b.revenue !== null && b.revenue !== undefined)
  const totalRevenue = list.reduce((s, b) => s + (b.revenue || 0), 0)
  const totalStaff = list.reduce((s, b) => s + b.staff, 0)

  return (
    <div className="space-y-6">
      {loadError && (
        <div role="alert" className="rounded-xl px-4 py-3 text-sm flex items-center justify-between" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          {loadError} <button onClick={load} className="underline">Retry</button>
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'Total Branches', value: list.length },
            { label: 'Team Members', value: totalStaff },
            ...(showRevenue ? [{ label: 'Combined Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}k` }] : []),
          ].map(s => (
            <div key={s.label} className="glass rounded-xl px-5 py-3">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        {isOwner && (
          <button onClick={() => setShowModal(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Branch
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(b => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-5 ${b.status !== 'active' ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4 gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-white truncate">{b.name}</h3>
                {(b.address || b.city) && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <MapPin size={11} className="flex-shrink-0" /> <span className="truncate">{[b.address, b.city].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${b.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-gray-400'}`}>{b.status}</span>
            </div>

            <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
              <span className="flex items-center gap-1">{b.phone && <><Phone size={12} /> {b.phone}</>}</span>
              {isOwner && (
                <button onClick={() => toggleStatus(b)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white">
                  <Power size={12} /> {b.status === 'active' ? 'Deactivate' : 'Reactivate'}
                </button>
              )}
            </div>

            <div className={`grid ${showRevenue ? 'grid-cols-3' : 'grid-cols-2'} gap-3 pt-3 border-t border-white/8`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                  <Users size={12} className="text-violet-400" /> {b.staff}
                </div>
                <p className="text-gray-500 text-xs">Team</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{b.appointments}</p>
                <p className="text-gray-500 text-xs">Appts</p>
              </div>
              {showRevenue && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                    <TrendingUp size={12} className="text-green-400" /> ₹{((b.revenue || 0) / 1000).toFixed(0)}k
                  </div>
                  <p className="text-gray-500 text-xs">Revenue</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Branch</h2>
              <button onClick={close} className="text-gray-400 hover:text-white" aria-label="Close"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4" noValidate>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
              {[
                { key: 'name', label: 'Branch Name', placeholder: 'e.g. Glow Salon - Juhu' },
                { key: 'city', label: 'City', placeholder: 'e.g. Mumbai' },
                { key: 'address', label: 'Address', placeholder: 'Full address' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1" htmlFor={`b-${f.key}`}>{f.label}</label>
                  <input id={`b-${f.key}`} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={close} className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving && <Loader2 size={15} className="animate-spin" />} Add Branch
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
