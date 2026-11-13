import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Phone, Star, TrendingUp } from 'lucide-react'

const initialStaff = [
  { id: 1, name: 'Riya Sharma', role: 'Senior Stylist', phone: '9876501001', email: 'riya@salon.com', services: ['Haircut', 'Hair Color'], appointments: 48, revenue: 72000, rating: 4.8, status: 'active' },
  { id: 2, name: 'Sunita Patel', role: 'Skin Specialist', phone: '9876501002', email: 'sunita@salon.com', services: ['Facial', 'Cleanup'], appointments: 35, revenue: 52500, rating: 4.6, status: 'active' },
  { id: 3, name: 'Pooja Mehta', role: 'Nail Technician', phone: '9876501003', email: 'pooja@salon.com', services: ['Manicure', 'Pedicure'], appointments: 42, revenue: 38000, rating: 4.7, status: 'active' },
  { id: 4, name: 'Meena Rao', role: 'Massage Therapist', phone: '9876501004', email: 'meena@salon.com', services: ['Massage', 'Body Wrap'], appointments: 28, revenue: 61600, rating: 4.9, status: 'active' },
  { id: 5, name: 'Divya Nair', role: 'Receptionist', phone: '9876501005', email: 'divya@salon.com', services: [], appointments: 0, revenue: 0, rating: 0, status: 'active' },
]

const roles = ['Senior Stylist', 'Stylist', 'Skin Specialist', 'Nail Technician', 'Massage Therapist', 'Receptionist', 'Manager']
const emptyForm = { name: '', role: '', phone: '', email: '' }

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.role) e.role = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Invalid phone'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStaff([{ id: Date.now(), ...form, services: [], appointments: 0, revenue: 0, rating: 0, status: 'active' }, ...staff])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {[
            { label: 'Total Staff', value: staff.length },
            { label: 'Active', value: staff.filter(s => s.status === 'active').length },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl px-5 py-3">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {staff.map(s => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-lg">
                  {s.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  <p className="text-violet-400 text-xs">{s.role}</p>
                </div>
              </div>
              <span className="bg-green-500/15 text-green-400 text-xs px-2 py-1 rounded-full">Active</span>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
              <Phone size={12} /> {s.phone}
            </div>

            {s.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {s.services.map(sv => (
                  <span key={sv} className="bg-violet-600/15 text-violet-300 text-xs px-2 py-0.5 rounded-full">{sv}</span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/8">
              <div className="text-center">
                <p className="text-white font-bold text-sm">{s.appointments}</p>
                <p className="text-gray-500 text-xs">Appts</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">₹{(s.revenue / 1000).toFixed(0)}k</p>
                <p className="text-gray-500 text-xs">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-sm flex items-center justify-center gap-0.5">
                  {s.rating > 0 ? <><Star size={10} className="fill-yellow-400" /> {s.rating}</> : '—'}
                </p>
                <p className="text-gray-500 text-xs">Rating</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Staff Member</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Staff name' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
                { key: 'email', label: 'Email', placeholder: 'staff@salon.com' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-400 block mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className={`w-full bg-white/5 border ${errors.role ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`}>
                  <option value="" className="bg-[#13131a]">Select role</option>
                  {roles.map(r => <option key={r} value={r} className="bg-[#13131a]">{r}</option>)}
                </select>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Staff</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
