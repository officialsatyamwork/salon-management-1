import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Users, Calendar, CreditCard } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Aug', revenue: 82000 }, { month: 'Sep', revenue: 94000 },
  { month: 'Oct', revenue: 88000 }, { month: 'Nov', revenue: 112000 },
  { month: 'Dec', revenue: 138000 }, { month: 'Jan', revenue: 124000 },
]

const serviceRevenue = [
  { name: 'Hair Color', revenue: 48000 }, { name: 'Facial', revenue: 32400 },
  { name: 'Massage', revenue: 28600 }, { name: 'Haircut', revenue: 22500 },
  { name: 'Manicure', revenue: 17600 }, { name: 'Waxing', revenue: 14400 },
]

const staffPerformance = [
  { name: 'Riya', appointments: 48, revenue: 72000 },
  { name: 'Sunita', appointments: 35, revenue: 52500 },
  { name: 'Pooja', appointments: 42, revenue: 38000 },
  { name: 'Meena', appointments: 28, revenue: 61600 },
]

const paymentMix = [
  { name: 'UPI', value: 45 }, { name: 'Cash', value: 30 }, { name: 'Card', value: 25 },
]
const PIE_COLORS = ['#6C3FC5', '#a78bfa', '#ec4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-sm">
        <p className="text-fg-2">{label}</p>
        <p className="text-fg font-semibold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const [range, setRange] = useState('6m')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { label: 'Revenue This Month', value: '₹1,24,000', change: '+12%', icon: TrendingUp },
            { label: 'Total Appointments', value: '312', change: '+8%', icon: Calendar },
            { label: 'New Customers', value: '48', change: '+15%', icon: Users },
            { label: 'Avg Ticket Size', value: '₹1,397', change: '+4%', icon: CreditCard },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center">
                  <s.icon size={16} className="text-violet-400" />
                </div>
                <span className="text-green-400 text-xs">{s.change}</span>
              </div>
              <p className="text-2xl font-black text-fg">{s.value}</p>
              <p className="text-fg-2 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-fg">Revenue Trend</h3>
            <p className="text-fg-2 text-sm">Last 6 months</p>
          </div>
          <div className="flex gap-2">
            {['3m', '6m', '1y'].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${range === r ? 'bg-violet-600 text-white' : 'glass text-fg-2'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C3FC5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C3FC5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#6C3FC5" strokeWidth={2} fill="url(#revGrad2)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold text-fg mb-1">Revenue by Service</h3>
          <p className="text-fg-2 text-sm mb-6">This month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceRevenue} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div className="glass rounded-lg px-3 py-2 text-sm">
                  <p className="text-fg font-semibold">₹{payload[0].value.toLocaleString()}</p>
                </div>
              ) : null} />
              <Bar dataKey="revenue" fill="#6C3FC5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Mix */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold text-fg mb-1">Payment Methods</h3>
          <p className="text-fg-2 text-sm mb-4">Distribution this month</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={paymentMix} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {paymentMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {paymentMix.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-fg-2 text-sm">{p.name}</span>
                  <span className="text-fg font-semibold text-sm ml-auto">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Staff Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="font-bold text-fg mb-6">Staff Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] whitespace-nowrap">
            <thead>
              <tr className="border-b border-line text-left text-xs text-fg-muted uppercase tracking-wider">
                <th className="pb-3 pr-6">Staff Member</th>
                <th className="pb-3 pr-6">Appointments</th>
                <th className="pb-3 pr-6">Revenue Generated</th>
                <th className="pb-3">Avg per Appointment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {staffPerformance.map(s => (
                <tr key={s.name} className="hover:bg-fg/[0.03] transition-colors">
                  <td className="py-3 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                        {s.name[0]}
                      </div>
                      <span className="text-fg text-sm font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-6 text-fg-2 text-sm">{s.appointments}</td>
                  <td className="py-3 pr-6 text-fg font-semibold text-sm">₹{s.revenue.toLocaleString()}</td>
                  <td className="py-3 text-fg-2 text-sm">₹{Math.round(s.revenue / s.appointments).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
