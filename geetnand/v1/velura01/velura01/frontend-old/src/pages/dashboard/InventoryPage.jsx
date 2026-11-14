import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, AlertTriangle, Package } from 'lucide-react'

const initialProducts = [
  { id: 1, name: 'Loreal Hair Color - Brown', category: 'Hair', stock: 15, minStock: 5, price: 850, supplier: 'Loreal India' },
  { id: 2, name: 'Wella Shampoo 500ml', category: 'Hair', stock: 8, minStock: 10, price: 650, supplier: 'Wella' },
  { id: 3, name: 'Facial Cleanser', category: 'Skin', stock: 20, minStock: 8, price: 450, supplier: 'Lotus' },
  { id: 4, name: 'Waxing Strips', category: 'Body', stock: 3, minStock: 10, price: 200, supplier: 'Rica' },
  { id: 5, name: 'Nail Polish Remover', category: 'Nails', stock: 12, minStock: 5, price: 120, supplier: 'OPI' },
  { id: 6, name: 'Massage Oil 200ml', category: 'Body', stock: 6, minStock: 5, price: 380, supplier: 'Biotique' },
]

const emptyForm = { name: '', category: '', stock: '', minStock: '', price: '', supplier: '' }
const categories = ['Hair', 'Skin', 'Nails', 'Body', 'Face']

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const lowStock = products.filter(p => p.stock <= p.minStock)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.stock || isNaN(form.stock)) e.stock = 'Required'
    if (!form.price || isNaN(form.price)) e.price = 'Required'
    return e
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setProducts([{ id: Date.now(), ...form, stock: Number(form.stock), minStock: Number(form.minStock) || 5, price: Number(form.price) }, ...products])
    setShowModal(false)
    setForm(emptyForm)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      {lowStock.length > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-orange-400 font-medium text-sm">Low Stock Alert</p>
            <p className="text-orange-300/70 text-xs mt-1">{lowStock.map(p => p.name).join(', ')} — need restocking</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Low Stock', value: lowStock.length, alert: true },
          ].map(s => (
            <div key={s.label} className={`glass rounded-xl px-5 py-3 ${s.alert && s.value > 0 ? 'border-orange-500/30' : ''}`}>
              <p className={`text-xl font-black ${s.alert && s.value > 0 ? 'text-orange-400' : 'text-white'}`}>{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center">
                      <Package size={14} className="text-violet-400" />
                    </div>
                    <span className="text-white text-sm font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{p.category}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold text-sm ${p.stock <= p.minStock ? 'text-orange-400' : 'text-white'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">₹{p.price}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{p.supplier}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock <= p.minStock ? 'bg-orange-500/15 text-orange-400' : 'bg-green-500/15 text-green-400'}`}>
                    {p.stock <= p.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Add Product</h2>
              <button onClick={() => { setShowModal(false); setErrors({}) }} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name"
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className={`w-full bg-white/5 border ${errors.category ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`}>
                  <option value="" className="bg-[#13131a]">Select category</option>
                  {categories.map(c => <option key={c} value={c} className="bg-[#13131a]">{c}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stock Qty</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0"
                    className={`w-full bg-white/5 border ${errors.stock ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                  {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Min Stock</label>
                  <input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} placeholder="5"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0"
                    className={`w-full bg-white/5 border ${errors.price ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500`} />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Supplier</label>
                  <input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="Supplier name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setErrors({}) }}
                  className="flex-1 glass py-2.5 rounded-xl text-gray-300 text-sm font-medium">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium">Add Product</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
