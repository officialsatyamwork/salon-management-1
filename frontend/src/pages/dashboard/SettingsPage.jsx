import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, Bell, Lock, GitBranch } from 'lucide-react'
import { useScope } from '../../store/auth'
import { usePlatform } from '../../store/platform'
import { Toggle } from '../../components/ui/Modal'
import { BIZ_TYPES } from '../../data/seed'

const inputCls = 'w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500 transition-colors'

const TABS = {
  business: { label: 'Business Profile', icon: Building2 },
  branch: { label: 'Branch Settings', icon: GitBranch },
  notifications: { label: 'Notifications', icon: Bell },
  security: { label: 'Security', icon: Lock },
}

export default function SettingsPage() {
  const { user, business, branches } = useScope()
  const updateBusiness = usePlatform(s => s.updateBusiness)
  const updateBranch = usePlatform(s => s.updateBranch)
  const branch = branches[0]

  const tabs = [
    user.role === 'owner' && 'business',
    user.role === 'manager' && branch && 'branch',
    'notifications', 'security',
  ].filter(Boolean)
  const [tab, setTab] = useState(tabs[0])
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState(() => business ? {
    name: business.name, type: business.type, ownerName: business.owner.name, ownerEmail: business.owner.email,
    phone: business.owner.phone, city: business.city, address: business.address, gstin: business.gstin || '', plan: business.plan,
  } : null)

  const [branchForm, setBranchForm] = useState(() => branch ? {
    phone: branch.phone, address: branch.address, hours: branch.hours, onlineBooking: branch.onlineBooking,
  } : null)

  const [notifications, setNotifications] = useState({
    appointmentReminders: true, newBookings: true, cancellations: true,
    lowStock: true, dailySummary: false, weeklySummary: true,
  })

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleSave = () => {
    setError('')
    if (tab === 'business') {
      if (!profile.name.trim()) { setError('Business name is required'); return }
      if (!/^\d{10}$/.test(profile.phone)) { setError('Phone must be a 10-digit number'); return }
      updateBusiness(business.id, profile)
    }
    if (tab === 'branch') {
      if (!/^\d{10}$/.test(branchForm.phone)) { setError('Phone must be a 10-digit number'); return }
      updateBranch(business.id, branch.id, branchForm)
    }
    if (tab === 'security') {
      if (!security.currentPassword) { setError('Enter current password'); return }
      if (security.newPassword.length < 8) { setError('New password must be 8+ characters'); return }
      if (security.newPassword !== security.confirmPassword) { setError('Passwords do not match'); return }
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
    flash()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(id => {
          const t = TABS[id]
          return (
            <button key={id} onClick={() => { setTab(id); setError('') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === id ? 'bg-violet-600 text-white' : 'glass text-fg-2 hover:text-fg'}`}>
              <t.icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 sm:p-6 space-y-5">

        {tab === 'business' && (
          <>
            <h3 className="font-bold text-fg">Business Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ['name', 'Business Name'], ['ownerName', 'Owner Name'], ['ownerEmail', 'Email Address'],
                ['phone', 'Phone Number'], ['city', 'City'], ['gstin', 'GST Number'],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-sm text-fg-2 block mb-1">{label}</span>
                  <input value={profile[key]} onChange={e => setProfile({ ...profile, [key]: key === 'gstin' ? e.target.value.toUpperCase() : e.target.value })}
                    className={inputCls} />
                </label>
              ))}
              <label className="block">
                <span className="text-sm text-fg-2 block mb-1">Business Type</span>
                <select value={profile.type} onChange={e => setProfile({ ...profile, type: e.target.value })} className={inputCls}>
                  {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-fg-2 block mb-1">Head Office Address</span>
              <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })}
                rows={2} className={`${inputCls} resize-none`} />
            </label>
          </>
        )}

        {tab === 'branch' && (
          <>
            <div>
              <h3 className="font-bold text-fg">{business.name} · {branch.name}</h3>
              <p className="text-fg-muted text-xs mt-0.5">Only this branch is affected. Business-wide settings are managed by the owner.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-fg-2 block mb-1">Branch Phone</span>
                <input value={branchForm.phone} onChange={e => setBranchForm({ ...branchForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm text-fg-2 block mb-1">Opening Hours</span>
                <input value={branchForm.hours} onChange={e => setBranchForm({ ...branchForm, hours: e.target.value })} className={inputCls} />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-fg-2 block mb-1">Address</span>
              <textarea value={branchForm.address} onChange={e => setBranchForm({ ...branchForm, address: e.target.value })}
                rows={2} className={`${inputCls} resize-none`} />
            </label>
            <div className="flex items-center justify-between py-3 border-t border-line">
              <div>
                <p className="text-fg text-sm font-medium">Online booking</p>
                <p className="text-fg-muted text-xs">Customers can book this branch from the website and WhatsApp</p>
              </div>
              <Toggle checked={branchForm.onlineBooking} onChange={v => setBranchForm({ ...branchForm, onlineBooking: v })} label="Online booking" />
            </div>
          </>
        )}

        {tab === 'notifications' && (
          <>
            <h3 className="font-bold text-fg">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Send reminders to customers before appointments' },
                { key: 'newBookings', label: 'New Bookings', desc: 'Notify when a new appointment is booked' },
                { key: 'cancellations', label: 'Cancellations', desc: 'Alert when an appointment is cancelled' },
                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when inventory falls below minimum' },
                { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive end-of-day business summary' },
                { key: 'weeklySummary', label: 'Weekly Report', desc: 'Receive weekly performance report' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between gap-4 py-3 border-b border-line last:border-0">
                  <div>
                    <p className="text-fg text-sm font-medium">{n.label}</p>
                    <p className="text-fg-muted text-xs">{n.desc}</p>
                  </div>
                  <Toggle checked={notifications[n.key]} onChange={v => setNotifications({ ...notifications, [n.key]: v })} label={n.label} />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'security' && (
          <>
            <h3 className="font-bold text-fg">Change Password</h3>
            <div className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirmPassword', label: 'Confirm New Password' },
              ].map(f => (
                <label key={f.key} className="block">
                  <span className="text-sm text-fg-2 block mb-1">{f.label}</span>
                  <input type="password" value={security[f.key]} placeholder="••••••••"
                    onChange={e => { setSecurity({ ...security, [f.key]: e.target.value }); setError('') }}
                    className={inputCls} />
                </label>
              ))}
            </div>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="pt-2">
          <button onClick={handleSave}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
            <Save size={15} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
