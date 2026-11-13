import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Star, Gift, CreditCard } from 'lucide-react'

const initialPackages = [
  { id: 1, name: 'Gold Membership', price: 5000, validity: 90, services: 'All Hair Services', discount: 15, members: 24, active: true },
  { id: 2, name: 'Silver Membership', price: 3000, validity: 60, services: 'Basic Services', discount: 10, members: 38, active: true },
  { id: 3, name: 'Bridal Package', price: 12000, validity: 30, services: 'Full Bridal Services', discount: 20, members: 6, active: true },
  { id: 4, name: 'Wellness Bundle', price: 8000, validity: 90, services: 'Spa & Massage', discount: 18, members: 15, active: true },
]

const loyaltyCustomers = [
  { id: 1, name: 'Deepa Rao', points: 345, tier: 'Gold', spent: 34500 },
  { id: 2, name: 'Priya Sharma', points: 184, tier: 'Silver', spent: 18400 },
  { id: 3, name: 'Anita Mehta', points: 122, tier: 'Silver', spent: 12200 },
  { id: 4, name: 'Kavya Nair', points: 78, tier: 'Bronze', spent: 7800 },
  { id: 5, name: 'Sonal Joshi', points: 32, tier: 'Bronze', spent: 3200 },
]

const tierColor = { Gold: 'text-yellow-400 bg-yellow-500/15', Silver: 'text-gray-300 bg-gray-500/15', Bronze: 'text-orange-400 bg-orange-500/15' }

const emptyForm = { name: '', price: '', validity: '', services: '', discount: '' }

export default function MembershipPage() {
  const [packages, setPackages] = useState(initialPackages)
  const [tab, setTab] = useState('packages')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.price || isNaN(form.price)) e.price = 'Required'
    if (!form.validity || isNaN(form.validity)) e.validity = 'Required'
    if (!form.services.trim()) e.services = 'Required'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setPackages([{ id: Date.now(), ...form, price: Number(form.price), validity: Number(form.validity), discount: Number(form.discount) || 0, members: 0, active: true }, ...packages])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {['packages', 'loyalty'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-violet-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
            {t === 'packages' ? 'Membership Packages' : 'Loyalty Points'}
          </button>
        ))}
      </div>

      {tab === 'packages' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {[
                { label: 'Total Packages', value: packages.length },
                { label: 'Active Members', value: packages.reduce((s, p) => s + p.members, 0) },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl px-5 py-3">
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Package
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center">
                    <CreditCard size={18} className="text-violet-400" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${pkg.active ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-400'}`}>
                    {pkg.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{pkg.services}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-black text-white">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">/ {pkg.validity} days</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/8 text-sm">
                  <div>
                    <p className="text-violet-400 font-semibold">{pkg.discount}% off</p>
                    <p className="text-gray-500 text-xs">Discount</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{pkg.members}</p>
                    <p className="text-gray-500 text-xs">Members</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {tab === 'loyalty' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-bold text-white mb-1">Loyalty Program Rules</h3>
            <p className="text-gray-400 text-sm mb-4">Customers earn 1 point for every ₹100 spent. Points can be redeemed at ₹1 per point.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { tier: 'Bronze', min: '0', max: '99 pts', color: 'text-orange-400' },
                { tier: 'Silver', min: '100', max: '249 pts', color: 'text-gray-300' },
                { tier: 'Gold', min: '250+', max: 'pts', color: 'text-yellow-400' },
              ].map(t => (
                <div key={t.tier} className="glass rounded-xl p-3 text-center">
                  <Star size={16} className={`${t.color} mx-auto mb-1`} />
                  <p className={`font-bold text-sm ${t.color}`}>{t.tier}</p>
                  <p className="text-gray-500 text-xs">{t.min} {t.max}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Points</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Redeemable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loyaltyCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                          {c.name[0]}
                        </div>
                        <span className="text-white text-sm font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColor[c.tier]}`}>{c.tier}</span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold text-sm">{c.points}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">₹{c.spent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-400 text-sm font-medium">₹{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Package</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { key: 'name', label: 'Package Name', placeholder: 'e.g. Platinum Membership' },
                { key: 'services', label: 'Included Services', placeholder: 'e.g. All Hair & Skin Services' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'price', label: 'Price (₹)', placeholder: '5000' },
                  { key: 'validity', label: 'Validity (days)', placeholder: '90' },
                  { key: 'discount', label: 'Discount (%)', placeholder: '10' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-sm text-gray-400 block mb-1">{f.label}</label>
                    <input type="number" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className={`w-full bg-white/5 border ${errors[f.key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                    {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Package</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
