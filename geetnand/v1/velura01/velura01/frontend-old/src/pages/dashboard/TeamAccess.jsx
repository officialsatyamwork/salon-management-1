import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Loader2, Mail, UserX, UserCheck } from 'lucide-react'
import { del, get, patch, post, put } from '../../lib/api'
import { useAuth, ROLE_LABELS } from '../../store/auth'

const emptyInvite = { fullName: '', email: '', phone: '', role: 'staff', jobTitle: '', salonIds: [] }

// Team members and their salon access. The owner grants or revokes an admin's
// access salon by salon; managers and staff belong to exactly one salon.
export default function TeamAccess() {
  const me = useAuth(s => s.user)
  const salons = me?.salons || []
  const salonName = Object.fromEntries(salons.map(s => [s.id, s.name]))
  const isOwner = me?.role === 'master_admin'
  const canManage = ['master_admin', 'super_admin', 'admin'].includes(me?.role)
  const roleOptions = isOwner ? ['super_admin', 'admin', 'manager', 'employee', 'staff'] : ['manager', 'employee', 'staff']

  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState(emptyInvite)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    get('/users?pageSize=100').then(r => setUsers(r.items)).catch(e => setError(e.message))
  }, [])
  useEffect(load, [load])

  const replaceUser = (u) => setUsers(list => list.map(x => x.id === u.id ? u : x))
  const flash = (msg) => { setNotice(msg); setTimeout(() => setNotice(''), 2500) }

  const run = async (id, fn) => {
    setBusyId(id); setError('')
    try { await fn() } catch (e) { setError(e.message) } finally { setBusyId(null) }
  }

  const toggleAdminSalon = (u, salonId) => run(u.id, async () => {
    const has = u.salonIds.includes(salonId)
    const updated = has
      ? await del(`/users/${u.id}/salons/${salonId}`)
      : await post(`/users/${u.id}/salons/${salonId}`)
    replaceUser(updated)
  })

  const moveTo = (u, salonId) => run(u.id, async () => replaceUser(await put(`/users/${u.id}/salons`, { salonIds: [salonId] })))

  const setActive = (u, isActive) => run(u.id, async () => replaceUser(await patch(`/users/${u.id}`, { isActive })))

  const resend = (u) => run(u.id, async () => { await post(`/users/${u.id}/resend-invite`); flash(`Invite re-sent to ${u.email}`) })

  const submitInvite = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Required'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (form.phone && !/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a 10-digit number'
    if (!form.salonIds.length) errs.salonIds = 'Pick at least one salon'
    if (form.role !== 'super_admin' && form.salonIds.length > 1) errs.salonIds = 'Managers, employees and staff belong to one salon'
    setFieldErrors(errs)
    if (Object.keys(errs).length) return
    setSaving(true); setError('')
    try {
      const body = { ...form, phone: form.phone || null, jobTitle: form.jobTitle || null }
      const created = await post('/users', body)
      setUsers(list => [...list, created])
      setShowInvite(false); setForm(emptyInvite)
      flash(`Invite sent to ${created.email}`)
    } catch (err) {
      setFieldErrors(err.code === 'email_taken' ? { email: err.message } : err.fields)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const pickSalon = (id) => {
    if (form.role === 'super_admin') {
      setForm(f => ({ ...f, salonIds: f.salonIds.includes(id) ? f.salonIds.filter(x => x !== id) : [...f.salonIds, id] }))
    } else {
      setForm(f => ({ ...f, salonIds: [id] }))
    }
  }

  if (!users && !error) return <div className="h-40 rounded-xl animate-pulse bg-white/5" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-white">Team & salon access</h3>
          <p className="text-gray-500 text-xs mt-0.5">
            {isOwner ? 'Super admins can be given any number of salons. Managers, employees and staff work in one salon.' : 'People in the salons you manage.'}
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShowInvite(true)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <Plus size={15} /> Invite member
          </button>
        )}
      </div>

      {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
      {notice && <p role="status" className="text-green-400 text-sm">{notice}</p>}

      <div className="overflow-x-auto -mx-2">
        <table className="w-full data-table text-sm">
          <thead>
            <tr><th className="text-left">Name</th><th className="text-left">Role</th><th className="text-left">Salon access</th><th className="text-left">Status</th>{canManage && <th />}</tr>
          </thead>
          <tbody>
            {(users || []).map(u => {
              const self = u.id === me.id
              const editable = canManage && !self && u.role !== 'master_admin' && (isOwner || ['manager', 'employee', 'staff'].includes(u.role))
              return (
                <tr key={u.id}>
                  <td>
                    <p className="text-white font-medium">{u.fullName}{self && <span className="text-gray-500"> (you)</span>}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </td>
                  <td className="text-gray-300">{ROLE_LABELS[u.role]}{u.jobTitle && <span className="text-gray-500 text-xs block">{u.jobTitle}</span>}</td>
                  <td>
                    {u.role === 'master_admin' ? <span className="text-gray-400">All salons</span>
                      : u.role === 'super_admin' && isOwner ? (
                        <div className="flex flex-wrap gap-1.5">
                          {salons.map(s => {
                            const on = u.salonIds.includes(s.id)
                            return (
                              <button key={s.id} disabled={busyId === u.id} onClick={() => toggleAdminSalon(u, s.id)}
                                aria-pressed={on} title={on ? 'Click to revoke access' : 'Click to grant access'}
                                className={`px-2 py-0.5 rounded-lg text-xs border transition-all ${on ? 'border-violet-500/60 bg-violet-500/15 text-violet-200' : 'border-white/10 text-gray-500 hover:text-gray-300'}`}>
                                {s.name}
                              </button>
                            )
                          })}
                        </div>
                      ) : editable && ['manager', 'employee', 'staff'].includes(u.role) ? (
                        <select value={u.salonIds[0] || ''} disabled={busyId === u.id} onChange={e => moveTo(u, e.target.value)}
                          className="input-field py-1 px-2 text-xs rounded-lg">
                          {salons.map(s => <option key={s.id} value={s.id} className="bg-[#13131a]">{s.name}</option>)}
                        </select>
                      ) : (
                        <span className="text-gray-400">{u.salonIds.map(id => salonName[id] || 'Other salon').join(', ') || '—'}</span>
                      )}
                  </td>
                  <td>
                    {!u.isActive ? <span className="badge bg-white/10 text-gray-400">Disabled</span>
                      : u.invitePending ? <span className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>Invite sent</span>
                        : <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>Active</span>}
                  </td>
                  {canManage && (
                    <td className="text-right whitespace-nowrap">
                      {editable && (
                        <div className="flex justify-end gap-1">
                          {busyId === u.id && <Loader2 size={14} className="animate-spin text-gray-500 mt-1.5" />}
                          {u.invitePending && u.isActive && (
                            <button onClick={() => resend(u)} title="Resend invite" className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5"><Mail size={14} /></button>
                          )}
                          <button onClick={() => setActive(u, !u.isActive)} title={u.isActive ? 'Disable account' : 'Enable account'}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5">
                            {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Invite team member</h2>
              <button onClick={() => { setShowInvite(false); setFieldErrors({}) }} className="text-gray-400 hover:text-white" aria-label="Close"><X size={20} /></button>
            </div>
            <form onSubmit={submitInvite} className="space-y-4" noValidate>
              {[['fullName', 'Full name'], ['email', 'Email'], ['phone', 'Phone (optional)'], ['jobTitle', 'Job title (optional)']].map(([k, label]) => (
                <div key={k}>
                  <label className="text-sm text-gray-400 block mb-1" htmlFor={`i-${k}`}>{label}</label>
                  <input id={`i-${k}`} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                    className={`w-full bg-white/5 border ${fieldErrors[k] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                  {fieldErrors[k] && <p className="text-red-400 text-xs mt-1">{fieldErrors[k]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-400 block mb-1" htmlFor="i-role">Role</label>
                <select id="i-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value, salonIds: form.salonIds.slice(0, 1) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                  {roleOptions.map(r => <option key={r} value={r} className="bg-[#13131a]">{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{form.role === 'super_admin' ? 'Salons they can access' : 'Salon'}</p>
                <div className="flex flex-wrap gap-2">
                  {salons.map(s => (
                    <button type="button" key={s.id} onClick={() => pickSalon(s.id)} aria-pressed={form.salonIds.includes(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs border ${form.salonIds.includes(s.id) ? 'border-violet-500/60 bg-violet-500/15 text-violet-200' : 'border-white/10 text-gray-400'}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
                {fieldErrors.salonIds && <p className="text-red-400 text-xs mt-1">{fieldErrors.salonIds}</p>}
              </div>
              <p className="text-gray-500 text-xs">They'll get an email with a link to set their password.</p>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowInvite(false)} className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  {saving && <Loader2 size={15} className="animate-spin" />} Send invite
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
