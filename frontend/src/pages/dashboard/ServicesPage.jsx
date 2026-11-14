import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Clock, DollarSign } from 'lucide-react'

const categories = ['Hair', 'Skin', 'Nails', 'Body', 'Face', 'Wellness']

const initialServices = [
  { id: 1, name: 'Haircut', category: 'Hair', duration: 30, price: 500, active: true },
  { id: 2, name: 'Hair Color', category: 'Hair', duration: 90, price: 2500, active: true },
  { id: 3, name: 'Facial', category: 'Skin', duration: 60, price: 1800, active: true },
  { id: 4, name: 'Manicure', category: 'Nails', duration: 45, price: 800, active: true },
  { id: 5, name: 'Pedicure', category: 'Nails', duration: 60, price: 1000, active: true },
  { id: 6, name: 'Full Body Massage', category: 'Body', duration: 60, price: 2200, active: true },
  { id: 7, name: 'Waxing (Full Arms)', category: 'Body', duration: 45, price: 1200, active: true },
  { id: 8, name: 'Eyebrow Threading', category: 'Face', duration: 15, price: 150, active: true },
]

const emptyForm = { name: '', category: '', duration: '', price: '' }

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [filterCat, setFilterCat] = useState('all')

  const filtered = filterCat === 'all' ? services : services.filter(s => s.category === filterCat)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.duration || isNaN(form.duration)) e.duration = 'Enter valid minutes'
    if (!form.price || isNaN(form.price)) e.price = 'Enter valid price'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setServices([{ id: Date.now(), ...form, duration: Number(form.duration), price: Number(form.price), active: true }, ...services])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  const toggleActive = (id) => setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterCat('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterCat === 'all' ? 'bg-violet-600 text-white' : 'glass text-fg-2 hover:text-fg'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterCat === c ? 'bg-violet-600 text-white' : 'glass text-fg-2 hover:text-fg'}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(s => (
          <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`glass rounded-2xl p-5 transition-all ${!s.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-violet-400 text-xs font-medium">{s.category}</span>
                <h3 className="font-semibold text-fg mt-0.5">{s.name}</h3>
              </div>
              <button onClick={() => toggleActive(s.id)}
                className={`text-xs px-2 py-1 rounded-full transition-all ${s.active ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-fg-2'}`}>
                {s.active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-fg-2">
              <span className="flex items-center gap-1"><Clock size={13} /> {s.duration} min</span>
              <span className="text-fg font-bold text-base">₹{s.price.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-panel border border-line rounded-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-fg">Add Service</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-fg-2 hover:text-fg"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm text-fg-2 block mb-1">Service Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Deep Conditioning"
                  className={`w-full bg-fg/5 border ${errors.name ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-violet-500`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-fg-2 block mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className={`w-full bg-fg/5 border ${errors.category ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500`}>
                  <option value="" className="bg-panel">Select category</option>
                  {categories.map(c => <option key={c} value={c} className="bg-panel">{c}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-fg-2 block mb-1">Duration (mins)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="60"
                    className={`w-full bg-fg/5 border ${errors.duration ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500`} />
                  {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration}</p>}
                </div>
                <div>
                  <label className="text-sm text-fg-2 block mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1000"
                    className={`w-full bg-fg/5 border ${errors.price ? 'border-red-500' : 'border-line'} rounded-xl px-4 py-2.5 text-fg text-sm focus:outline-none focus:border-violet-500`} />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-fg-2 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Service</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
