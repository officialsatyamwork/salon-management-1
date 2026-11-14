import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Send, Users, MessageSquare, Mail, Megaphone } from 'lucide-react'

const initialCampaigns = [
  { id: 1, name: 'Diwali Special Offer', type: 'whatsapp', audience: 'All Customers', sent: 284, opened: 198, status: 'sent', date: '2025-01-10' },
  { id: 2, name: 'Birthday Wishes - January', type: 'sms', audience: 'Birthday This Month', sent: 12, opened: 12, status: 'sent', date: '2025-01-01' },
  { id: 3, name: 'Re-engagement Campaign', type: 'email', audience: 'Inactive 30+ Days', sent: 0, opened: 0, status: 'draft', date: '2025-01-15' },
  { id: 4, name: 'New Service Launch', type: 'whatsapp', audience: 'Gold Members', sent: 0, opened: 0, status: 'scheduled', date: '2025-01-20' },
]

const typeIcon = { whatsapp: MessageSquare, sms: Send, email: Mail }
const typeColor = { whatsapp: 'text-green-400 bg-green-500/15', sms: 'text-blue-400 bg-blue-500/15', email: 'text-violet-400 bg-violet-500/15' }
const statusColor = { sent: 'bg-green-500/15 text-green-400', draft: 'bg-gray-500/15 text-fg-2', scheduled: 'bg-yellow-500/15 text-yellow-400' }

const emptyForm = { name: '', type: 'whatsapp', audience: '', message: '' }
const audiences = ['All Customers', 'Gold Members', 'Silver Members', 'Birthday This Month', 'Inactive 30+ Days', 'New Customers']

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.audience) e.audience = 'Required'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  const handleCreate = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setCampaigns([{ id: Date.now(), ...form, sent: 0, opened: 0, status: 'draft', date: new Date().toISOString().split('T')[0] }, ...campaigns])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0)
  const totalOpened = campaigns.reduce((s, c) => s + c.opened, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: campaigns.length, icon: Megaphone },
          { label: 'Messages Sent', value: totalSent, icon: Send },
          { label: 'Total Opened', value: totalOpened, icon: MessageSquare },
          { label: 'Open Rate', value: totalSent ? `${Math.round(totalOpened / totalSent * 100)}%` : '0%', icon: Users },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center mb-3">
              <s.icon size={16} className="text-violet-400" />
            </div>
            <p className="text-2xl font-black text-fg">{s.value}</p>
            <p className="text-fg-2 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-fg">Campaigns</h3>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map(c => {
          const Icon = typeIcon[c.type]
          return (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor[c.type]}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <h4 className="font-semibold text-fg text-sm">{c.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[c.status]}`}>{c.status}</span>
                </div>
                <p className="text-fg-muted text-xs">{c.audience} · {c.date}</p>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-fg font-semibold">{c.sent}</p>
                  <p className="text-fg-muted text-xs">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-fg font-semibold">{c.opened}</p>
                  <p className="text-fg-muted text-xs">Opened</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-semibold">{c.sent ? `${Math.round(c.opened / c.sent * 100)}%` : '—'}</p>
                  <p className="text-fg-muted text-xs">Rate</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-panel border border-line rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-fg">New Campaign</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-fg-2 hover:text-fg"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-fg-2 block mb-1">Campaign Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. New Year Offer"
                  className={`w-full bg-fg/5 border ${errors.name ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-fg-2 block mb-1">Channel</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500">
                    <option value="whatsapp" className="bg-panel">WhatsApp</option>
                    <option value="sms" className="bg-panel">SMS</option>
                    <option value="email" className="bg-panel">Email</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-fg-2 block mb-1">Audience</label>
                  <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                    className={`w-full bg-fg/5 border ${errors.audience ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500`}>
                    <option value="" className="bg-panel">Select audience</option>
                    {audiences.map(a => <option key={a} value={a} className="bg-panel">{a}</option>)}
                  </select>
                  {errors.audience && <p className="text-red-400 text-xs mt-1">{errors.audience}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm text-fg-2 block mb-1">Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4} placeholder="Write your campaign message..."
                  className={`w-full bg-fg/5 border ${errors.message ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500 resize-none`} />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-fg-2 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Save Draft</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
