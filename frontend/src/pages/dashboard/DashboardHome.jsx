import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Users, Calendar, CreditCard, ArrowUpRight, Clock } from 'lucide-react'

const revenueData = [
  { day: 'Mon', revenue: 12400 }, { day: 'Tue', revenue: 18200 }, { day: 'Wed', revenue: 14800 },
  { day: 'Thu', revenue: 22100 }, { day: 'Fri', revenue: 19600 }, { day: 'Sat', revenue: 28400 }, { day: 'Sun', revenue: 16900 },
]

const serviceData = [
  { name: 'Haircut', count: 45 }, { name: 'Facial', count: 32 }, { name: 'Massage', count: 28 },
  { name: 'Manicure', count: 22 }, { name: 'Waxing', count: 18 },
]

const recentAppointments = [
  { id: 1, customer: 'Priya Sharma', service: 'Hair Color', staff: 'Riya', time: '10:00 AM', status: 'completed' },
  { id: 2, customer: 'Anita Mehta', service: 'Facial', staff: 'Sunita', time: '11:30 AM', status: 'ongoing' },
  { id: 3, customer: 'Kavya Nair', service: 'Manicure', staff: 'Pooja', time: '12:00 PM', status: 'upcoming' },
  { id: 4, customer: 'Deepa Rao', service: 'Massage', staff: 'Meena', time: '2:00 PM', status: 'upcoming' },
  { id: 5, customer: 'Sonal Joshi', service: 'Haircut', staff: 'Riya', time: '3:30 PM', status: 'cancelled' },
]

const statusConfig = {
  completed: { label: 'Completed', bg: 'rgba(34,197,94,0.1)', color: '#4ade80', dot: '#22c55e' },
  ongoing: { label: 'Ongoing', bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', dot: '#3b82f6' },
  upcoming: { label: 'Upcoming', bg: 'rgba(234,179,8,0.1)', color: '#facc15', dot: '#eab308' },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.1)', color: '#f87171', dot: '#ef4444' },
}

const stats = [
  {
    label: "Today's Revenue", value: '₹18,450', change: '+12%', icon: TrendingUp,
    iconBg: 'rgba(124,58,237,0.15)', iconColor: '#a78bfa',
    accent: 'rgba(124,58,237,0.5)',
  },
  {
    label: 'Appointments', value: '24', change: '+3 today', icon: Calendar,
    iconBg: 'rgba(59,130,246,0.15)', iconColor: '#60a5fa',
    accent: 'rgba(59,130,246,0.5)',
  },
  {
    label: 'Total Customers', value: '1,284', change: '+7 this week', icon: Users,
    iconBg: 'rgba(16,185,129,0.15)', iconColor: '#34d399',
    accent: 'rgba(16,185,129,0.5)',
  },
  {
    label: 'Pending Payments', value: '₹3,200', change: '2 invoices', icon: CreditCard,
    iconBg: 'rgba(245,158,11,0.15)', iconColor: '#fbbf24',
    accent: 'rgba(245,158,11,0.5)',
  },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1a1a28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px' }}>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 2 }}>{label}</p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>₹{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function DashboardHome() {
  return (
    <div className="space-y-5 page-enter">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.iconBg }}>
                <s.icon size={17} style={{ color: s.iconColor }} />
              </div>
              <span className="flex items-center gap-1 text-[11.5px] font-medium" style={{ color: '#4ade80' }}>
                <ArrowUpRight size={11} /> {s.change}
              </span>
            </div>
            <p className="text-[22px] font-bold text-white tracking-tight leading-none mb-1">{s.value}</p>
            <p className="text-[12.5px] text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[15px] font-semibold text-white">Weekly Revenue</p>
              <p className="text-[12.5px] text-gray-500 mt-0.5">₹1,32,400 this week</p>
            </div>
            <span className="flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
              <TrendingUp size={12} /> +18% vs last week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11.5 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.2)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass-card rounded-2xl p-5"
        >
          <p className="text-[15px] font-semibold text-white mb-0.5">Top Services</p>
          <p className="text-[12.5px] text-gray-500 mb-5">This month</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 11.5 }} axisLine={false} tickLine={false} width={58} />
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div style={{ background: '#1a1a28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 12px' }}>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{payload[0].value} bookings</p>
                </div>
              ) : null} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" radius={[0, 5, 5, 0]}>
                {serviceData.map((_, i) => (
                  <rect key={i} fill={`rgba(124,58,237,${0.4 + i * 0.12})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-[15px] font-semibold text-white">Today's Appointments</p>
            <p className="text-[12.5px] text-gray-500 mt-0.5">5 appointments scheduled</p>
          </div>
          <a href="/dashboard/appointments"
            className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.1)' }}>
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Service</th>
                <th className="text-left">Staff</th>
                <th className="text-left">Time</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map(apt => {
                const s = statusConfig[apt.status]
                return (
                  <tr key={apt.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                          {apt.customer[0]}
                        </div>
                        <span className="font-medium text-white">{apt.customer}</span>
                      </div>
                    </td>
                    <td className="text-gray-400">{apt.service}</td>
                    <td className="text-gray-400">{apt.staff}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={11} /> {apt.time}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: s.bg, color: s.color }}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ background: s.dot }} />
                        {s.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
