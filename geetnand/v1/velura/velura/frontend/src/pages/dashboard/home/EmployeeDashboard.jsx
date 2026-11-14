import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CalendarCheck, CheckCircle2, Wallet, Star, Clock, StickyNote, Play, Check } from 'lucide-react'
import { WelcomeHeader, StatCard, Panel, ChartTooltip, StatusPill, Avatar } from '../../../components/dashboard/widgets'
import { AXIS_TICK, TONES, inr } from '../../../components/dashboard/chart'

const initialSchedule = [
  { id: 1, time: '10:00 AM', customer: 'Priya Sharma', service: 'Hair Color', duration: '90 min', status: 'completed' },
  { id: 2, time: '11:45 AM', customer: 'Neha Gupta', service: 'Haircut & Blow-dry', duration: '45 min', status: 'completed' },
  { id: 3, time: '12:45 PM', customer: 'Ritika Jain', service: 'Keratin Treatment', duration: '120 min', status: 'completed' },
  { id: 4, time: '3:00 PM', customer: 'Deepa Rao', service: 'Hair Spa', duration: '60 min', status: 'upcoming', note: 'Prefers lukewarm water, sensitive scalp' },
  { id: 5, time: '4:15 PM', customer: 'Kavya Nair', service: 'Root Touch-up', duration: '60 min', status: 'upcoming' },
  { id: 6, time: '5:30 PM', customer: 'Sonal Joshi', service: 'Haircut', duration: '30 min', status: 'upcoming' },
]

const week = [
  { day: 'Mon', services: 7 }, { day: 'Tue', services: 5 }, { day: 'Wed', services: 8 },
  { day: 'Thu', services: 6 }, { day: 'Fri', services: 9 }, { day: 'Sat', services: 11 }, { day: 'Sun', services: 6 },
]

const reviews = [
  { name: 'Priya Sharma', rating: 5, text: 'Anita nailed the colour exactly how I wanted. Lovely experience!', when: 'Today' },
  { name: 'Neha Gupta', rating: 5, text: 'Quick, friendly and a great haircut.', when: 'Yesterday' },
  { name: 'Ritu Malhotra', rating: 4, text: 'Very good keratin, just ran 10 minutes late.', when: '3 days ago' },
]

export default function EmployeeDashboard({ user, business, branch }) {
  const [schedule, setSchedule] = useState(initialSchedule)
  const advance = id => setSchedule(list => list.map(s => s.id !== id ? s
    : { ...s, status: s.status === 'upcoming' ? 'ongoing' : 'completed' }))

  const done = schedule.filter(s => s.status === 'completed').length
  const next = schedule.find(s => s.status === 'ongoing') || schedule.find(s => s.status === 'upcoming')

  return (
    <div className="space-y-5 page-enter">
      <WelcomeHeader user={user} subtitle={`${user.title} · ${business.name}, ${branch.name}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={CalendarCheck} label="My appointments today" value={schedule.length} change={`${schedule.length - done} left`} trend="neutral" tone="blue" />
        <StatCard icon={CheckCircle2} label="Completed today" value={done} change="On track" trend="neutral" tone="green" delay={0.05} />
        <StatCard icon={Wallet} label="Commission this month" value={inr.format(12840)} change="+₹1,920" tone="violet" delay={0.1} />
        <StatCard icon={Star} label="My rating" value="4.9" change="126 reviews" trend="neutral" tone="amber" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title={next?.status === 'ongoing' ? 'In progress' : 'Next client'} subtitle={next ? `${next.time} · ${next.duration}` : 'Nothing left today'}>
          {next ? (
            <div className="rounded-2xl p-4 border border-line"
              style={{ background: 'linear-gradient(135deg, var(--brand-soft), var(--gold-soft))' }}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={next.customer} tone="rose" size={44} />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-fg truncate">{next.customer}</p>
                  <p className="text-[12.5px] text-fg-2">{next.service}</p>
                </div>
              </div>
              {next.note && (
                <p className="flex gap-2 text-[12px] text-fg-2 mb-3 p-2.5 rounded-lg bg-fg/[0.04]">
                  <StickyNote size={13} className="flex-shrink-0 mt-0.5" /> {next.note}
                </p>
              )}
              <button onClick={() => advance(next.id)}
                className="btn-primary w-full py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1.5">
                {next.status === 'ongoing' ? <><Check size={15} /> Mark complete</> : <><Play size={14} /> Check in & start</>}
              </button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <CheckCircle2 size={26} className="mx-auto mb-2" style={{ color: TONES.green }} />
              <p className="text-[13px] font-semibold text-fg">All done for today</p>
              <p className="text-[12px] text-fg-muted">Great work, {user.name.split(' ')[0]}!</p>
            </div>
          )}
        </Panel>

        <Panel className="lg:col-span-2" title="My schedule" subtitle="Today" delay={0.25}>
          <ul className="space-y-2">
            {schedule.map(s => (
              <li key={s.id}
                className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border border-line ${s.status === 'ongoing' ? 'bg-blue-500/[0.06]' : 'bg-fg/[0.02]'}`}>
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-fg w-[84px] flex-shrink-0">
                  <Clock size={12} className="text-fg-muted" />{s.time}
                </span>
                <div className="flex-1 min-w-[140px]">
                  <p className={`text-[13px] font-semibold ${s.status === 'completed' ? 'text-fg-2' : 'text-fg'}`}>{s.customer}</p>
                  <p className="text-[11.5px] text-fg-muted">{s.service} · {s.duration}</p>
                </div>
                <StatusPill status={s.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Services this week" subtitle={`${week.reduce((t, d) => t + d.services, 0)} completed`} delay={0.3}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={week} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip format={v => `${v} services`} />} cursor={{ fill: 'rgba(128,128,128,0.08)' }} />
              <Bar dataKey="services" radius={[5, 5, 0, 0]} maxBarSize={26}>
                {week.map(d => <Cell key={d.day} fill={d.day === 'Sat' ? TONES.rose : `${TONES.rose}66`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel className="lg:col-span-2" title="Recent reviews" subtitle="What your clients say" delay={0.35}>
          <ul className="space-y-3">
            {reviews.map(r => (
              <li key={r.name} className="flex gap-3">
                <Avatar name={r.name} tone="gold" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <p className="text-[13px] font-semibold text-fg">{r.name}</p>
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={11} fill={i < r.rating ? TONES.amber : 'none'} color={TONES.amber} />
                      ))}
                    </span>
                    <span className="text-[11px] text-fg-muted">{r.when}</span>
                  </div>
                  <p className="text-[12.5px] text-fg-2 mt-0.5">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
