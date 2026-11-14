import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, Bell, Lock, Users, Loader2 } from 'lucide-react'
import { get, post, put } from '../../lib/api'
import { useAuth } from '../../store/auth'
import TeamAccess from './TeamAccess'

const allTabs = [
  { id: 'business', label: 'Business Profile', icon: Building2, roles: ['master_admin', 'super_admin'] },
  { id: 'team', label: 'Team & Access', icon: Users, roles: ['master_admin', 'super_admin', 'manager'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['master_admin', 'super_admin'] },
  { id: 'security', label: 'Security', icon: Lock, roles: ['master_admin', 'super_admin', 'manager', 'staff', 'customer'] },
]

const businessFields = [
  { key: 'name', label: 'Business Name' },
  { key: 'type', label: 'Business Type' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'gst', label: 'GST Number' },
  { key: 'currency', label: 'Currency' },
]

const notificationFields = [
  { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Send reminders to customers before appointments' },
  { key: 'newBookings', label: 'New Bookings', desc: 'Notify when a new appointment is booked' },
  { key: 'cancellations', label: 'Cancellations', desc: 'Alert when an appointment is cancelled' },
  { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when inventory falls below minimum' },
  { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive end-of-day business summary' },
  { key: 'weeklySummary', label: 'Weekly Report', desc: 'Receive weekly performance report' },
]

export default function SettingsPage() {
  const user = useAuth(s => s.user)
  const setSession = useAuth(s => s.setSession)
  const tabs = allTabs.filter(t => t.roles.includes(user?.role))
  const [tab, setTab] = useState(tabs[0].id)
  const isOwner = user?.role === 'master_admin'

  const [business, setBusiness] = useState(null)
  const [notifications, setNotifications] = useState(null)
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setError(''); setFieldErrors({}); setSaved(false)
    if (tab === 'business' && !business) get('/settings/business').then(setBusiness).catch(e => setError(e.message))
    if (tab === 'notifications' && !notifications) get('/settings/notifications').then(setNotifications).catch(e => setError(e.message))
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setError(''); setFieldErrors({}); setSaving(true)
    try {
      if (tab === 'business') {
        setBusiness(await put('/settings/business', { ...business, email: business.email || null, phone: business.phone || null, gst: business.gst || null }))
      } else if (tab === 'notifications') {
        setNotifications(await put('/settings/notifications', notifications))
      } else if (tab === 'security') {
        if (!security.currentPassword) throw new Error('Enter current password')
        if (security.newPassword.length < 8) throw new Error('New password must be 8+ characters')
        if (security.newPassword !== security.confirmPassword) throw new Error('Passwords do not match')
        // Changing the password signs out other devices and returns a fresh session for this one.
        setSession(await post('/auth/change-password', { currentPassword: security.currentPassword, newPassword: security.newPassword }))
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message)
      setFieldErrors(err.fields || {})
    } finally {
      setSaving(false)
    }
  }

  const readOnly = tab === 'business' && !isOwner
  const loading = (tab === 'business' && !business) || (tab === 'notifications' && !notifications)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-violet-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 space-y-5">

        {tab === 'team' && <TeamAccess />}

        {tab !== 'team' && loading && !error && <div className="h-40 rounded-xl animate-pulse bg-white/5" />}

        {tab === 'business' && business && (
          <>
            <div>
              <h3 className="font-bold text-white">Business Information</h3>
              {readOnly && <p className="text-gray-500 text-xs mt-1">Only the owner can change these details.</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {businessFields.map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1" htmlFor={`s-${f.key}`}>{f.label}</label>
                  <input id={`s-${f.key}`} value={business[f.key] ?? ''} disabled={readOnly}
                    onChange={e => setBusiness({ ...business, [f.key]: e.target.value })}
                    className={`w-full bg-white/5 border ${fieldErrors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-60`} />
                  {fieldErrors[f.key] && <p className="text-red-400 text-xs mt-1">{fieldErrors[f.key]}</p>}
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1" htmlFor="s-address">Address</label>
              <textarea id="s-address" value={business.address ?? ''} disabled={readOnly} onChange={e => setBusiness({ ...business, address: e.target.value })}
                rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none disabled:opacity-60" />
            </div>
          </>
        )}

        {tab === 'notifications' && notifications && (
          <>
            <h3 className="font-bold text-white">Notification Preferences</h3>
            <div className="space-y-4">
              {notificationFields.map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{n.label}</p>
                    <p className="text-gray-500 text-xs">{n.desc}</p>
                  </div>
                  <button role="switch" aria-checked={notifications[n.key]} aria-label={n.label}
                    onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                    className={`w-11 h-6 rounded-full transition-all relative ${notifications[n.key] ? 'bg-violet-600' : 'bg-white/10'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[n.key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'security' && (
          <>
            <div>
              <h3 className="font-bold text-white">Change Password</h3>
              <p className="text-gray-500 text-xs mt-1">You'll stay signed in here; other devices will be signed out.</p>
            </div>
            <div className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password', ac: 'current-password' },
                { key: 'newPassword', label: 'New Password', ac: 'new-password' },
                { key: 'confirmPassword', label: 'Confirm New Password', ac: 'new-password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1" htmlFor={`p-${f.key}`}>{f.label}</label>
                  <input id={`p-${f.key}`} type="password" autoComplete={f.ac} value={security[f.key]}
                    onChange={e => { setSecurity({ ...security, [f.key]: e.target.value }); setError('') }}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
            </div>
          </>
        )}

        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}

        {tab !== 'team' && !readOnly && !loading && (
          <div className="pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
