import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, MapPin, Phone, Users, TrendingUp } from 'lucide-react'

const initialBranches = [
  { id: 1, name: 'Glow Salon - Andheri', city: 'Mumbai', address: '12, Link Road, Andheri West', phone: '9876500001', staff: 8, revenue: 124000, appointments: 312, status: 'active' },
  { id: 2, name: 'Glow Salon - Bandra', city: 'Mumbai', address: '45, Hill Road, Bandra West', phone: '9876500002', staff: 6, revenue: 98000, appointments: 248, status: 'active' },
  { id: 3, name: 'Glow Salon - Powai', city: 'Mumbai', address: '8, Hiranandani Gardens, Powai', phone: '9876500003', staff: 5, revenue: 76000, appointments: 192, status: 'active' },
]

const emptyForm = { name: '', city: '', address: '', phone: '' }

export default function BranchesPage() {
  const [branches, setBranches] = useState(initialBranches)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Invalid phone'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setBranches([{ id: Date.now(), ...form, staff: 0, revenue: 0, appointments: 0, status: 'active' }, ...branches])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  const totalRevenue = branches.reduce((s, b) => s + b.revenue, 0)
  const totalStaff = branches.reduce((s, b) => s + b.staff, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-4">
          {[
            { label: 'Total Branches', value: branches.length },
            { label: 'Total Staff', value: totalStaff },
            { label: 'Combined Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}k` },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl px-5 py-3">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Branch
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map(b => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">{b.name}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                  <MapPin size={11} /> {b.address}
                </div>
              </div>
              <span className="bg-green-500/15 text-green-400 text-xs px-2 py-1 rounded-full capitalize">{b.status}</span>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
              <Phone size={12} /> {b.phone}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                  <Users size={12} className="text-violet-400" /> {b.staff}
                </div>
                <p className="text-gray-500 text-xs">Staff</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-sm">{b.appointments}</p>
                <p className="text-gray-500 text-xs">Appts</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                  <TrendingUp size={12} className="text-green-400" /> ₹{(b.revenue / 1000).toFixed(0)}k
                </div>
                <p className="text-gray-500 text-xs">Revenue</p>
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
              <h2 className="text-lg font-bold text-white">Add Branch</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { key: 'name', label: 'Branch Name', placeholder: 'e.g. Glow Salon - Juhu' },
                { key: 'city', label: 'City', placeholder: 'e.g. Mumbai' },
                { key: 'address', label: 'Address', placeholder: 'Full address' },
                { key: 'phone', label: 'Phone', placeholder: '10-digit number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Branch</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
