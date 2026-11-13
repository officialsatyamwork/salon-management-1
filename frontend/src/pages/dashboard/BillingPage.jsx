import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search, X, Printer, Check } from 'lucide-react'

const servicesList = [
  { id: 1, name: 'Haircut', price: 500, category: 'Hair' },
  { id: 2, name: 'Hair Color', price: 2500, category: 'Hair' },
  { id: 3, name: 'Facial', price: 1800, category: 'Skin' },
  { id: 4, name: 'Manicure', price: 800, category: 'Nails' },
  { id: 5, name: 'Pedicure', price: 1000, category: 'Nails' },
  { id: 6, name: 'Massage', price: 2200, category: 'Body' },
  { id: 7, name: 'Waxing', price: 1200, category: 'Body' },
  { id: 8, name: 'Eyebrow Threading', price: 150, category: 'Face' },
]

const recentInvoices = [
  { id: 'INV-001', customer: 'Priya Sharma', amount: 3300, date: '2025-01-15', status: 'paid', method: 'UPI' },
  { id: 'INV-002', customer: 'Anita Mehta', amount: 1800, date: '2025-01-15', status: 'paid', method: 'Cash' },
  { id: 'INV-003', customer: 'Kavya Nair', amount: 800, date: '2025-01-14', status: 'pending', method: '—' },
  { id: 'INV-004', customer: 'Deepa Rao', amount: 4200, date: '2025-01-14', status: 'paid', method: 'Card' },
]

export default function BillingPage() {
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState('')
  const [discount, setDiscount] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')
  const [success, setSuccess] = useState(false)
  const [tab, setTab] = useState('pos')

  const addToCart = (service) => {
    const existing = cart.find(i => i.id === service.id)
    if (existing) {
      setCart(cart.map(i => i.id === service.id ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { ...service, qty: 1 }])
    }
  }

  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id))

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discountAmt = Math.round(subtotal * discount / 100)
  const gst = Math.round((subtotal - discountAmt) * 0.18)
  const total = subtotal - discountAmt + gst

  const handleCheckout = () => {
    if (!cart.length || !customer.trim()) return
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setCart([])
      setCustomer('')
      setDiscount(0)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {['pos', 'invoices'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'bg-violet-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
            {t === 'pos' ? 'New Invoice / POS' : 'Invoice History'}
          </button>
        ))}
      </div>

      {tab === 'pos' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Select Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {servicesList.map(s => (
                  <button key={s.id} onClick={() => addToCart(s)}
                    className="glass rounded-xl p-3 text-left hover:border-violet-500/40 transition-all group">
                    <p className="text-xs text-violet-400 mb-1">{s.category}</p>
                    <p className="font-medium text-white text-sm">{s.name}</p>
                    <p className="text-gray-400 text-sm">₹{s.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-white">Invoice</h3>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Customer Name</label>
              <input value={customer} onChange={e => setCustomer(e.target.value)}
                placeholder="Enter customer name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500" />
            </div>

            <div className="flex-1 min-h-32">
              {cart.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">Add services to invoice</p>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs">₹{item.price} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white text-sm font-semibold">₹{item.price * item.qty}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>

            <div className="space-y-1 text-sm border-t border-white/10 pt-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({discount}%)</span><span>-₹{discountAmt}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>GST (18%)</span><span>₹{gst}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-1 border-t border-white/10">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['cash', 'upi', 'card'].map(m => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    className={`py-2 rounded-xl text-sm font-medium capitalize transition-all ${payMethod === m ? 'bg-violet-600 text-white' : 'glass text-gray-400'}`}>
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCheckout}
              disabled={!cart.length || !customer.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${cart.length && customer.trim() ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>
              {success ? <><Check size={16} /> Invoice Generated!</> : 'Generate Invoice'}
            </button>
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-violet-400 text-sm font-medium">{inv.id}</td>
                  <td className="px-6 py-4 text-white text-sm">{inv.customer}</td>
                  <td className="px-6 py-4 text-white text-sm font-semibold">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{inv.date}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm uppercase">{inv.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'paid' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
