import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Phone, Mail, Star, X, User } from 'lucide-react'

const initialCustomers = [
  { id: 1, name: 'Priya Sharma', phone: '9876543210', email: 'priya@email.com', visits: 12, spent: 18400, points: 184, lastVisit: '2025-01-14', dob: '1990-03-15', notes: 'Prefers Riya for hair services' },
  { id: 2, name: 'Anita Mehta', phone: '9876543211', email: 'anita@email.com', visits: 8, spent: 12200, points: 122, lastVisit: '2025-01-12', dob: '1985-07-22', notes: '' },
  { id: 3, name: 'Kavya Nair', phone: '9876543212', email: 'kavya@email.com', visits: 5, spent: 7800, points: 78, lastVisit: '2025-01-10', dob: '1995-11-08', notes: 'Allergic to certain wax' },
  { id: 4, name: 'Deepa Rao', phone: '9876543213', email: 'deepa@email.com', visits: 20, spent: 34500, points: 345, lastVisit: '2025-01-15', dob: '1988-05-30', notes: 'VIP customer' },
  { id: 5, name: 'Sonal Joshi', phone: '9876543214', email: 'sonal@email.com', visits: 3, spent: 3200, points: 32, lastVisit: '2025-01-08', dob: '1998-09-12', notes: '' },
]

const emptyForm = { name: '', phone: '', email: '', dob: '', notes: '' }

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Invalid phone'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setCustomers([{ id: Date.now(), ...form, visits: 0, spent: 0, points: 0, lastVisit: '-' }, ...customers])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Total Customers', value: customers.length },
            { label: 'Active This Month', value: 8 },
            { label: 'New This Week', value: 3 },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl px-4 py-3">
              <p className="text-xl font-black text-fg">{s.value}</p>
              <p className="text-fg-2 text-xs leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 lg:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
              className="bg-fg/5 border border-line rounded-xl pl-9 pr-4 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-violet-500 w-full lg:w-52" />
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap flex-shrink-0">
            <Plus size={16} /> <span className="hidden sm:inline">Add Customer</span><span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(c => (
          <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl p-4 sm:p-5 hover:border-violet-500/20 transition-all cursor-pointer"
            onClick={() => setSelected(c)}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-lg">
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-fg truncate">{c.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-fg-2 text-sm flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                    {c.email && <span className="text-fg-2 text-sm flex items-center gap-1 min-w-0 break-all"><Mail size={12} /> {c.email}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:text-right pl-16 sm:pl-0 flex-shrink-0">
                <div>
                  <p className="text-fg font-semibold">₹{c.spent.toLocaleString()}</p>
                  <p className="text-fg-muted text-xs">Total Spent</p>
                </div>
                <div>
                  <p className="text-fg font-semibold">{c.visits}</p>
                  <p className="text-fg-muted text-xs">Visits</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-semibold flex items-center gap-1"><Star size={12} /> {c.points}</p>
                  <p className="text-fg-muted text-xs">Points</p>
                </div>
              </div>
            </div>
            {c.notes && <p className="text-fg-muted text-xs mt-3 sm:pl-16">📝 {c.notes}</p>}
          </motion.div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-panel border border-line rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-fg">Add Customer</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-fg-2 hover:text-fg"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Customer name' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
                { key: 'email', label: 'Email (optional)', placeholder: 'email@example.com' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-fg-2 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-fg/5 border ${errors[f.key] ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm text-fg-2 block mb-1">Date of Birth (optional)</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="text-sm text-fg-2 block mb-1">Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2} placeholder="Preferences, allergies, etc."
                  className="w-full bg-fg/5 border border-line rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-fg-2 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Customer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-panel border border-line rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-fg">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="text-fg-2 hover:text-fg"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-2xl">
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-fg">{selected.name}</h3>
                <p className="text-fg-2 text-sm">{selected.phone}</p>
                <p className="text-fg-2 text-sm">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Visits', value: selected.visits },
                { label: 'Total Spent', value: `₹${selected.spent.toLocaleString()}` },
                { label: 'Loyalty Points', value: selected.points },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <p className="text-fg font-bold">{s.value}</p>
                  <p className="text-fg-muted text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-line">
                <span className="text-fg-2">Last Visit</span>
                <span className="text-fg">{selected.lastVisit}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-line">
                <span className="text-fg-2">Birthday</span>
                <span className="text-fg">{selected.dob || '—'}</span>
              </div>
              {selected.notes && (
                <div className="py-2">
                  <span className="text-fg-2">Notes: </span>
                  <span className="text-fg">{selected.notes}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
