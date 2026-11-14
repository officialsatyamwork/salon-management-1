import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Clock, User, Scissors, X, Check } from 'lucide-react'

const initialAppointments = [
  { id: 1, customer: 'Priya Sharma', phone: '9876543210', service: 'Hair Color', staff: 'Riya', date: '2025-01-15', time: '10:00', duration: 90, status: 'confirmed', amount: 2500 },
  { id: 2, customer: 'Anita Mehta', phone: '9876543211', service: 'Facial', staff: 'Sunita', date: '2025-01-15', time: '11:30', duration: 60, status: 'ongoing', amount: 1800 },
  { id: 3, customer: 'Kavya Nair', phone: '9876543212', service: 'Manicure', staff: 'Pooja', date: '2025-01-15', time: '12:00', duration: 45, status: 'confirmed', amount: 800 },
  { id: 4, customer: 'Deepa Rao', phone: '9876543213', service: 'Massage', staff: 'Meena', date: '2025-01-15', time: '14:00', duration: 60, status: 'confirmed', amount: 2200 },
  { id: 5, customer: 'Sonal Joshi', phone: '9876543214', service: 'Haircut', staff: 'Riya', date: '2025-01-15', time: '15:30', duration: 30, status: 'cancelled', amount: 500 },
  { id: 6, customer: 'Meera Patel', phone: '9876543215', service: 'Waxing', staff: 'Pooja', date: '2025-01-16', time: '10:00', duration: 45, status: 'confirmed', amount: 1200 },
]

const statusStyle = {
  confirmed: 'bg-blue-500/15 text-blue-400',
  ongoing: 'bg-green-500/15 text-green-400',
  completed: 'bg-gray-500/15 text-gray-400',
  cancelled: 'bg-red-500/15 text-red-400',
  'no-show': 'bg-orange-500/15 text-orange-400',
}

const emptyForm = { customer: '', phone: '', service: '', staff: '', date: '', time: '', notes: '' }

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = appointments.filter(a => {
    const matchSearch = a.customer.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || a.status === filter
    return matchSearch && matchFilter
  })

  const validate = () => {
    const e = {}
    if (!form.customer.trim()) e.customer = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.service.trim()) e.service = 'Required'
    if (!form.staff.trim()) e.staff = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.time) e.time = 'Required'
    return e
  }

  const handleBook = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const newApt = { id: Date.now(), ...form, duration: 60, status: 'confirmed', amount: 0 }
    setAppointments([newApt, ...appointments])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  const updateStatus = (id, status) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'confirmed', 'ongoing', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${filter === s ? 'bg-violet-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 w-48" />
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={16} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: appointments.filter(a => a.date === '2025-01-15').length },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
          { label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Staff</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white text-sm">{apt.customer}</p>
                    <p className="text-gray-500 text-xs">{apt.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{apt.service}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{apt.staff}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300 text-sm">{apt.date}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1"><Clock size={10} /> {apt.time}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">₹{apt.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyle[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {apt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(apt.id, 'completed')}
                          className="text-green-400 hover:text-green-300 transition-colors" title="Mark Complete">
                          <Check size={16} />
                        </button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <button onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="text-red-400 hover:text-red-300 transition-colors" title="Cancel">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No appointments found</div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Book Appointment</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              {[
                { key: 'customer', label: 'Customer Name', placeholder: 'Full name' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
                { key: 'service', label: 'Service', placeholder: 'e.g. Haircut' },
                { key: 'staff', label: 'Staff', placeholder: 'Staff member name' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.date ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Time</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.time ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2} placeholder="Any special requests..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-gray-300 hover:text-white text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Book Now
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
