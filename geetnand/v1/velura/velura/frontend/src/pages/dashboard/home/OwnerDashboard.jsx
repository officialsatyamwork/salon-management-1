import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { IndianRupee, CalendarCheck, GitBranch, UserCheck, Plus, Crown, ArrowRight, Star, Store } from 'lucide-react'
import { WelcomeHeader, StatCard, Panel, ChartTooltip, StatusPill, Avatar, Meter } from '../../../components/dashboard/widgets'
import { AXIS_TICK, TONES, inr, lakh } from '../../../components/dashboard/chart'
import { usePlatform } from '../../../store/platform'
import { WEEK, branchWeek, businessTotals } from '../../../data/metrics'

const PALETTE = [TONES.violet, TONES.rose, TONES.gold, TONES.cyan, TONES.green, TONES.blue]

export default function OwnerDashboard({ user, business }) {
  const plans = usePlatform(s => s.plans)
  const settings = usePlatform(s => s.settings)
  const branches = business.branches
  const plan = plans.find(p => p.id === business.plan)
  const totals = businessTotals(branches)
  const colorOf = i => PALETTE[i % PALETTE.length]

  const weekly = WEEK.map((day, i) => Object.fromEntries([['day', day], ...branches.map(b => [b.name, branchWeek(b)[i].revenue])]))
  const weekTotal = weekly.reduce((s, d) => s + branches.reduce((t, b) => t + d[b.name], 0), 0)
  const atLimit = branches.length >= (plan?.maxBranches || 0)

  const addBranch = (
    <Link to="/dashboard/branches?new=1" className="btn-primary px-3.5 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
      <Plus size={15} /> Add branch
    </Link>
  )

  if (branches.length === 0) {
    return (
      <div className="space-y-5 page-enter">
        <WelcomeHeader user={user} subtitle={`Welcome to ${settings.platformName}! Let's set up ${business.name}.`} />
        <div className="glass-card rounded-2xl p-10 text-center max-w-xl mx-auto">
          <span className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
            <Store size={24} />
          </span>
          <h3 className="text-[18px] font-bold text-fg mb-1">Add your first branch</h3>
          <p className="text-[13px] text-fg-2 mb-5">Each branch gets its own dashboard, manager, staff, services and reports. You'll see all of them here.</p>
          <div className="flex justify-center">{addBranch}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 page-enter">
      <WelcomeHeader user={user}
        subtitle={`${business.name} across ${branches.length} branch${branches.length > 1 ? 'es' : ''}: ${branches.map(b => b.name).join(', ')}`}
        actions={<>
          <Link to="/dashboard/staff" className="btn-ghost px-3.5 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5">
            <UserCheck size={15} /> Manage staff
          </Link>
          {addBranch}
        </>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={IndianRupee} label="Revenue this month" value={lakh(totals.revenueMonth)} change="+9.4%" tone="violet" />
        <StatCard icon={CalendarCheck} label="Appointments today" value={totals.todayAppointments} change="+11" tone="blue" delay={0.05} />
        <StatCard icon={GitBranch} label="Branches" value={`${branches.length} / ${plan?.maxBranches}`} change={`${plan?.name} plan`} trend="neutral" tone="cyan" delay={0.1} />
        <StatCard icon={UserCheck} label="Team members" value={totals.staff + branches.length} change={`${branches.length} managers`} trend="neutral" tone="gold" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Revenue by branch" subtitle={`${inr.format(weekTotal)} this week`}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={weekly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                {branches.map((b, i) => (
                  <linearGradient key={b.id} id={`g-${b.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorOf(i)} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={colorOf(i)} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {branches.map((b, i) => (
                <Area key={b.id} type="monotone" dataKey={b.name} stroke={colorOf(i)} strokeWidth={2} fill={`url(#g-${b.id})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Plan & usage" subtitle={`${plan?.name} · ${inr.format(plan?.price || 0)}/month`} delay={0.25}
          action={<Crown size={18} style={{ color: TONES.gold }} />}>
          <div className="space-y-4">
            {[['Branches', branches.length, plan?.maxBranches], ['Staff seats', totals.staff, plan?.maxStaff], ['SMS credits used', Math.round((plan?.smsCredits || 0) * 0.62), plan?.smsCredits]].map(([label, used, max]) => (
              <div key={label}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-fg-2">{label}</span>
                  <span className="font-semibold text-fg">{used.toLocaleString('en-IN')} / {max?.toLocaleString('en-IN')}</span>
                </div>
                <Meter value={used} max={max} tone={used / max > 0.8 ? 'amber' : 'rose'} />
              </div>
            ))}
            {atLimit && <p className="text-[12px] text-fg-2">You've used every branch on your plan. Upgrade to open more.</p>}
            <Link to="/pricing" className="btn-primary w-full py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-1.5">
              Upgrade plan <ArrowRight size={14} />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Branch performance" subtitle="This month · open a branch for its own dashboard" bodyClassName="" delay={0.3}
          action={<Link to="/dashboard/branches" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>Manage →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] whitespace-nowrap data-table">
              <thead><tr>
                <th className="text-left">Branch</th><th className="text-left">Manager</th>
                <th className="text-right">Revenue</th><th className="text-right">Appointments</th><th className="text-right">Rating</th><th />
              </tr></thead>
              <tbody>
                {branches.map((b, i) => (
                  <tr key={b.id}>
                    <td>
                      <Link to={`/dashboard/branches/${b.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: colorOf(i) }} />{b.name}
                      </Link>
                    </td>
                    <td className="text-fg-2">{b.manager.name}</td>
                    <td className="text-right">
                      <span className="font-semibold">{b.revenueMonth ? lakh(b.revenueMonth) : '—'}</span>
                      {b.revenueMonth > 0 && (
                        <span className="ml-2 text-[11.5px]" style={{ color: b.growth < 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {b.growth > 0 ? '+' : ''}{b.growth}%
                        </span>
                      )}
                    </td>
                    <td className="text-right text-fg-2">{b.appointmentsMonth.toLocaleString('en-IN')}</td>
                    <td className="text-right">
                      {b.rating ? <span className="inline-flex items-center gap-1"><Star size={12} fill={TONES.amber} color={TONES.amber} />{b.rating}</span> : '—'}
                    </td>
                    <td className="text-right">
                      <Link to={`/dashboard/branches/${b.id}`} aria-label={`Open ${b.name} dashboard`} className="inline-flex text-fg-muted hover:text-fg"><ArrowRight size={15} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Branch managers" subtitle="One per branch" delay={0.35}>
          <ul className="space-y-3">
            {branches.map((b, i) => (
              <li key={b.id} className="flex items-center gap-3">
                <Avatar name={b.manager.name} tone={['violet', 'rose', 'gold', 'cyan', 'green', 'blue'][i % 6]} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-fg truncate">{b.manager.name}</p>
                  <p className="text-[11.5px] text-fg-muted truncate">{b.name} · {b.manager.email}</p>
                </div>
                <StatusPill status={b.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
