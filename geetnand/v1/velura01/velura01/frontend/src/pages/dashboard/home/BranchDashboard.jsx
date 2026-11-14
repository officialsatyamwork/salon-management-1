import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { IndianRupee, CalendarCheck, UserCheck, TrendingUp, ChevronRight, MapPin, Phone, Clock, Globe, UserRound, Settings, Check, Lock, ShieldCheck, Plus } from 'lucide-react'
import { WelcomeHeader, StatCard, Panel, ChartTooltip, StatusPill, Avatar, Meter } from '../../../components/dashboard/widgets'
import { AXIS_TICK, TONES, inr, lakh } from '../../../components/dashboard/chart'
import { Toggle } from '../../../components/ui/Modal'
import { usePlatform } from '../../../store/platform'
import { branchToday, branchWeek } from '../../../data/metrics'

const APPOINTMENTS = [
  { customer: 'Priya Sharma', service: 'Hair Color', staff: 'Anita Nair', time: '10:00 AM', status: 'completed' },
  { customer: 'Neha Gupta', service: 'Facial', staff: 'Sunita Patel', time: '11:30 AM', status: 'completed' },
  { customer: 'Kavya Nair', service: 'Manicure', staff: 'Pooja Mehta', time: '12:30 PM', status: 'ongoing' },
  { customer: 'Deepa Rao', service: 'Hair Spa', staff: 'Anita Nair', time: '3:00 PM', status: 'upcoming' },
  { customer: 'Sonal Joshi', service: 'Haircut', staff: 'Rakesh Kumar', time: '4:30 PM', status: 'upcoming' },
]

const STAFF = [
  { name: 'Anita Nair', role: 'Senior Stylist', status: 'busy', note: 'Until 12:15' },
  { name: 'Sunita Patel', role: 'Skin Specialist', status: 'available', note: 'Next at 2:00' },
  { name: 'Pooja Mehta', role: 'Nail Technician', status: 'busy', note: 'Until 1:00' },
  { name: 'Rakesh Kumar', role: 'Stylist', status: 'break', note: 'Back 1:30' },
  { name: 'Meena Rao', role: 'Massage Therapist', status: 'leave', note: 'Full day' },
]
const STAFF_TONE = { busy: 'violet', available: 'green', break: 'amber', leave: 'red' }

const SERVICES = [
  { name: 'Haircut & Styling', price: 600, bookings: 142 },
  { name: 'Hair Color (Global)', price: 2800, bookings: 64 },
  { name: 'Gold Facial', price: 1800, bookings: 58 },
  { name: 'Manicure & Pedicure', price: 1100, bookings: 51 },
  { name: 'Full Body Massage', price: 2400, bookings: 37 },
]

const CHECKLIST = [
  'Sanitize stations & tools',
  "Confirm today's bookings on WhatsApp",
  'Check towels & linen stock',
  'Brief team on walk-in rotation',
  'Count cash drawer at closing',
]

function BranchAccess({ business, branch }) {
  const accounts = usePlatform(s => s.accounts)
  const setBranchAccess = usePlatform(s => s.setBranchAccess)
  const managers = accounts.filter(a => a.businessId === business.id && a.role === 'manager')
  const branchName = id => business.branches.find(b => b.id === id)?.name

  return (
    <Panel title="Branch access" subtitle="Managers who can open this branch" delay={0.45}
      action={<ShieldCheck size={17} className="text-fg-muted" />}>
      {managers.length === 0 ? <p className="text-[13px] text-fg-muted">No manager accounts yet.</p> : (
        <ul className="space-y-3">
          {managers.map(m => {
            const isOwnBranch = m.email === branch.manager.email
            const granted = (m.branchIds || []).includes(branch.id)
            const others = (m.branchIds || []).filter(id => id !== branch.id).map(branchName).filter(Boolean)
            return (
              <li key={m.email} className="flex items-center gap-3">
                <Avatar name={m.name} tone={isOwnBranch ? 'cyan' : 'gray'} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-fg truncate">{m.name}</p>
                  <p className="text-[11.5px] text-fg-muted truncate">
                    {isOwnBranch ? 'Manager of this branch' : others.length ? `Manages ${others.join(', ')}` : 'No branch assigned'}
                  </p>
                </div>
                {isOwnBranch
                  ? <Lock size={14} className="text-fg-muted" aria-label="Always has access" />
                  : <Toggle checked={granted} onChange={v => setBranchAccess(m.email, branch.id, v)} label={`${m.name} can access ${branch.name}`} />}
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

export default function BranchDashboard({ user, business, branch, switchable = [] }) {
  const [done, setDone] = useState([0, 1])
  const today = branchToday(branch)
  const week = branchWeek(branch)
  const isOwner = user.role === 'owner'
  const toggleTask = i => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i])

  return (
    <div className="space-y-5 page-enter">
      {isOwner && (
        <nav className="flex items-center gap-1.5 text-[13px] text-fg-muted" aria-label="Breadcrumb">
          <Link to="/dashboard" className="hover:text-fg">All branches</Link>
          <ChevronRight size={13} />
          <span className="text-fg font-medium">{branch.name}</span>
        </nav>
      )}

      <WelcomeHeader user={user}
        subtitle={`${business.name} · ${branch.name} branch · ${branch.address}, ${branch.city}`}
        actions={
          <Link to="/dashboard/appointments" className="btn-primary px-3.5 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
            <Plus size={15} /> Book appointment
          </Link>
        } />

      {switchable.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {switchable.map(b => (
            <Link key={b.id} to={`/dashboard/branches/${b.id}`}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${b.id === branch.id ? 'bg-violet-600 text-white' : 'glass text-fg-2 hover:text-fg'}`}>
              {b.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={IndianRupee} label="Revenue today" value={inr.format(today.revenue)} change="+12%" tone="violet" />
        <StatCard icon={TrendingUp} label="Revenue this month" value={lakh(branch.revenueMonth)}
          change={`${branch.growth > 0 ? '+' : ''}${branch.growth}%`} trend={branch.growth < 0 ? 'down' : 'up'} tone="gold" delay={0.05} />
        <StatCard icon={CalendarCheck} label="Appointments today" value={today.appointments} change={`${today.walkIns} walk-ins`} trend="neutral" tone="blue" delay={0.1} />
        <StatCard icon={UserCheck} label="Staff on duty" value={`${today.onDuty}/${branch.staff}`} change="1 on leave" trend="neutral" tone="green" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Branch revenue" subtitle={`${inr.format(week.reduce((s, d) => s + d.revenue, 0))} this week`}>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={week} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="branchRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TONES.violet} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={TONES.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={TONES.violet} strokeWidth={2} fill="url(#branchRev)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Branch details" subtitle="Settings for this location" delay={0.25}
          action={<Link to="/dashboard/settings" aria-label="Branch settings" className="text-fg-muted hover:text-fg"><Settings size={16} /></Link>}>
          <ul className="space-y-3 text-[13px]">
            {[
              [UserRound, 'Manager', branch.manager.name],
              [MapPin, 'Address', `${branch.address}, ${branch.city}`],
              [Phone, 'Phone', branch.phone],
              [Clock, 'Hours', branch.hours],
              [Globe, 'Online booking', branch.onlineBooking ? 'On' : 'Off'],
            ].map(([Icon, k, v]) => (
              <li key={k} className="flex gap-3">
                <Icon size={15} className="text-fg-muted flex-shrink-0 mt-0.5" />
                <span className="text-fg-muted w-24 flex-shrink-0">{k}</span>
                <span className="text-fg font-medium min-w-0 break-words">{v}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Today's appointments" subtitle={`${today.appointments} booked at ${branch.name}`} bodyClassName="" delay={0.3}
          action={<Link to="/dashboard/calendar" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>Open calendar →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] whitespace-nowrap data-table">
              <thead><tr>
                <th className="text-left">Customer</th><th className="text-left">Service</th><th className="text-left">Staff</th>
                <th className="text-left">Time</th><th className="text-left">Status</th>
              </tr></thead>
              <tbody>
                {APPOINTMENTS.map(a => (
                  <tr key={a.customer}>
                    <td><span className="flex items-center gap-2.5 font-medium"><Avatar name={a.customer} size={28} />{a.customer}</span></td>
                    <td className="text-fg-2">{a.service}</td>
                    <td className="text-fg-2">{a.staff}</td>
                    <td className="text-fg-2">{a.time}</td>
                    <td><StatusPill status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Staff on duty" subtitle="Live status" delay={0.35}
          action={<Link to="/dashboard/staff" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>Team →</Link>}>
          <ul className="space-y-3">
            {STAFF.map(s => (
              <li key={s.name} className="flex items-center gap-3">
                <Avatar name={s.name} tone={STAFF_TONE[s.status]} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-fg truncate">{s.name}</p>
                  <p className="text-[11.5px] text-fg-muted truncate">{s.role} · {s.note}</p>
                </div>
                <StatusPill status={s.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className={`grid gap-4 ${isOwner ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
        <Panel title="Services & pricing" subtitle="Most booked this month" delay={0.4}
          action={<Link to="/dashboard/services" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>Edit →</Link>}>
          <ul className="space-y-3.5">
            {SERVICES.map(s => (
              <li key={s.name}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-fg font-medium">{s.name}</span>
                  <span className="text-fg-2">{inr.format(s.price)} · {s.bookings}</span>
                </div>
                <Meter value={s.bookings} max={SERVICES[0].bookings} tone="violet" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Daily operations" subtitle={`${done.length} of ${CHECKLIST.length} done`} delay={0.42}>
          <Meter value={done.length} max={CHECKLIST.length} tone="green" />
          <ul className="mt-3 space-y-1">
            {CHECKLIST.map((task, i) => (
              <li key={task}>
                <button onClick={() => toggleTask(i)} className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-fg/5 transition-colors text-left">
                  <span className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${done.includes(i) ? 'border-transparent' : 'border-line'}`}
                    style={done.includes(i) ? { background: TONES.green } : undefined}>
                    {done.includes(i) && <Check size={13} className="text-white" />}
                  </span>
                  <span className={`text-[13px] ${done.includes(i) ? 'text-fg-muted line-through' : 'text-fg'}`}>{task}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {isOwner && <BranchAccess business={business} branch={branch} />}
      </div>
    </div>
  )
}
