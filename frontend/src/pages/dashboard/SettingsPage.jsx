import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, Bell, Lock, Globe, Palette } from 'lucide-react'

const tabs = [
  { id: 'business', label: 'Business Profile', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('business')
  const [saved, setSaved] = useState(false)

  const [business, setBusiness] = useState({
    name: 'Glow Salon', type: 'Salon', email: 'owner@glowsalon.com',
    phone: '9876500000', address: '12, Link Road, Andheri West, Mumbai',
    gst: '27AABCU9603R1ZX', currency: 'INR', timezone: 'Asia/Kolkata',
  })

  const [notifications, setNotifications] = useState({
    appointmentReminders: true, newBookings: true, cancellations: true,
    lowStock: true, dailySummary: false, weeklySummary: true,
  })

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')

  const handleSave = () => {
    if (tab === 'security') {
      if (!security.currentPassword) { setPwError('Enter current password'); return }
      if (security.newPassword.length < 8) { setPwError('New password must be 8+ characters'); return }
      if (security.newPassword !== security.confirmPassword) { setPwError('Passwords do not match'); return }
      setPwError('')
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
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

        {tab === 'business' && (
          <>
            <h3 className="font-bold text-white">Business Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Business Name' },
                { key: 'type', label: 'Business Type' },
                { key: 'email', label: 'Email Address' },
                { key: 'phone', label: 'Phone Number' },
                { key: 'gst', label: 'GST Number' },
                { key: 'currency', label: 'Currency' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input value={business[f.key]} onChange={e => setBusiness({ ...business, [f.key]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Address</label>
              <textarea value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })}
                rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 resize-none" />
            </div>
          </>
        )}

        {tab === 'notifications' && (
          <>
            <h3 className="font-bold text-white">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Send reminders to customers before appointments' },
                { key: 'newBookings', label: 'New Bookings', desc: 'Notify when a new appointment is booked' },
                { key: 'cancellations', label: 'Cancellations', desc: 'Alert when an appointment is cancelled' },
                { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when inventory falls below minimum' },
                { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive end-of-day business summary' },
                { key: 'weeklySummary', label: 'Weekly Report', desc: 'Receive weekly performance report' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{n.label}</p>
                    <p className="text-gray-500 text-xs">{n.desc}</p>
                  </div>
                  <button onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
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
            <h3 className="font-bold text-white">Change Password</h3>
            <div className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirmPassword', label: 'Confirm New Password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input type="password" value={security[f.key]}
                    onChange={e => { setSecurity({ ...security, [f.key]: e.target.value }); setPwError('') }}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              ))}
              {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
            </div>
          </>
        )}

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
