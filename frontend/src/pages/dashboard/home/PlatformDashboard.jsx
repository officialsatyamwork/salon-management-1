import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Store, Power, GitBranch, Users, CircleDollarSign, TrendingUp, Plus, Check, X, CheckCircle2, ArrowRight } from 'lucide-react'
import { WelcomeHeader, StatCard, Panel, ChartTooltip } from '../../../components/dashboard/widgets'
import { AXIS_TICK, TONES, inr, lakh } from '../../../components/dashboard/chart'
import ActivityFeed from '../../../components/platform/ActivityFeed'
import ReasonDialog from '../../../components/platform/ReasonDialog'
import { usePlatform, planPrice } from '../../../store/platform'
import { PLATFORM_HISTORY } from '../../../data/seed'

const PLAN_COLORS = [TONES.gray, TONES.cyan, TONES.violet, TONES.gold, TONES.rose, TONES.green]

export default function PlatformDashboard({ user }) {
  const businesses = usePlatform(s => s.businesses)
  const plans = usePlatform(s => s.plans)
  const activity = usePlatform(s => s.activity)
  const approve = usePlatform(s => s.approve)
  const reject = usePlatform(s => s.reject)
  const [rejecting, setRejecting] = useState(null)

  const registered = businesses.filter(b => !['pending', 'rejected'].includes(b.status))
  const active = registered.filter(b => b.status === 'active')
  const inactive = registered.length - active.length
  const pending = businesses.filter(b => b.status === 'pending')
  const branches = registered.reduce((s, b) => s + b.branches.length, 0)
  const staff = registered.reduce((s, b) => s + b.branches.reduce((t, br) => t + br.staff, 0), 0)
  // One owner per salon plus one manager per branch.
  const leads = registered.length + branches
  const mrr = active.reduce((s, b) => s + planPrice(plans, b.plan), 0)

  const history = PLATFORM_HISTORY.map((h, i, all) => i === all.length - 1
    ? { ...h, businesses: registered.length, branches, subscriptions: mrr }
    : h)
  const platformRevenue = history.reduce((s, h) => s + h.subscriptions + h.addons, 0)

  const planMix = plans
    .map((p, i) => ({ name: p.name, value: active.filter(b => b.plan === p.id).length, color: PLAN_COLORS[i % PLAN_COLORS.length] }))
    .filter(p => p.value)

  const topSalons = [...active]
    .map(b => ({ ...b, gmv: b.branches.reduce((s, br) => s + br.revenueMonth, 0) }))
    .sort((a, b) => b.gmv - a.gmv)
    .slice(0, 5)

  return (
    <div className="space-y-5 page-enter">
      <WelcomeHeader user={user}
        subtitle="Everything happening across the Keeng platform today."
        actions={
          <Link to="/dashboard/salons?new=1" className="btn-primary px-3.5 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
            <Plus size={15} /> Create salon
          </Link>
        } />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard icon={Store} label="Salon businesses" value={registered.length} change={pending.length ? `${pending.length} pending` : 'All reviewed'} trend="neutral" tone="violet" />
        <StatCard icon={Power} label="Active / inactive" value={`${active.length} / ${inactive}`} change={`${Math.round(active.length / Math.max(1, registered.length) * 100)}% active`} trend="neutral" tone="green" delay={0.04} />
        <StatCard icon={GitBranch} label="Total branches" value={branches} change="+2 this month" tone="cyan" delay={0.08} />
        <StatCard icon={Users} label="Users & employees" value={(leads + staff).toLocaleString('en-IN')} change={`${staff} staff`} trend="neutral" tone="blue" delay={0.12} />
        <StatCard icon={CircleDollarSign} label="Subscription revenue / mo" value={inr.format(mrr)} change="+9.3%" tone="gold" delay={0.16} />
        <StatCard icon={TrendingUp} label="Platform revenue (12 mo)" value={lakh(platformRevenue)} change="+22%" tone="rose" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Business growth" subtitle="Salons and branches on the platform, last 12 months">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g-biz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={TONES.violet} stopOpacity={0.3} /><stop offset="100%" stopColor={TONES.violet} stopOpacity={0} /></linearGradient>
                <linearGradient id="g-br" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={TONES.cyan} stopOpacity={0.25} /><stop offset="100%" stopColor={TONES.cyan} stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} padding={{ left: 14, right: 14 }} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip format={v => v} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="branches" name="Branches" stroke={TONES.cyan} strokeWidth={2} fill="url(#g-br)" />
              <Area type="monotone" dataKey="businesses" name="Salon businesses" stroke={TONES.violet} strokeWidth={2} fill="url(#g-biz)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Plans in use" subtitle={`${active.length} active subscriptions`} delay={0.25}
          action={<Link to="/dashboard/plans" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>Manage →</Link>}>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planMix} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={3} stroke="none">
                  {planMix.map(p => <Cell key={p.name} fill={p.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip format={v => `${v} salons`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {planMix.map(p => (
              <li key={p.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-fg-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />{p.name}</span>
                <span className="font-semibold text-fg">{p.value}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Platform revenue" subtitle="Subscriptions and add-ons (SMS credits, extra seats)" delay={0.3}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} interval={0} padding={{ left: 14, right: 14 }} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(128,128,128,0.08)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="subscriptions" name="Subscriptions" stackId="r" fill={TONES.gold} maxBarSize={26} />
              <Bar dataKey="addons" name="Add-ons" stackId="r" fill={TONES.rose} radius={[5, 5, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Registration requests" subtitle={`${pending.length} waiting for review`} delay={0.35}
          action={<Link to="/dashboard/salons?status=pending" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>All →</Link>}>
          {pending.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={26} className="mx-auto mb-2" style={{ color: TONES.green }} />
              <p className="text-[13px] font-semibold text-fg">No pending requests</p>
              <p className="text-[12px] text-fg-muted">New salon sign-ups will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {pending.map(b => (
                <li key={b.id} className="p-3 rounded-xl bg-fg/[0.03] border border-line">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/dashboard/salons/${b.id}`} className="min-w-0">
                      <p className="text-[13px] font-semibold text-fg truncate hover:underline">{b.name}</p>
                      <p className="text-[11.5px] text-fg-muted truncate">{b.owner.name} · {b.city} · {b.branches.length || 1} branch{b.branches.length > 1 ? 'es' : ''}</p>
                    </Link>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => approve(b.id)} aria-label={`Approve ${b.name}`}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"><Check size={14} /></button>
                      <button onClick={() => setRejecting(b)} aria-label={`Reject ${b.name}`}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><X size={14} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Panel className="lg:col-span-2" title="Recent activity" subtitle="Across all salons" delay={0.4}>
          <ActivityFeed items={activity.slice(0, 6)} />
        </Panel>

        <Panel className="lg:col-span-3" title="Top salons" subtitle="By monthly revenue processed" bodyClassName="" delay={0.45}
          action={<Link to="/dashboard/salons" className="text-[12.5px] font-medium" style={{ color: 'var(--brand)' }}>All salons →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] whitespace-nowrap data-table">
              <thead><tr>
                <th className="text-left">Salon</th><th className="text-left">Plan</th>
                <th className="text-right">Branches</th><th className="text-right">Revenue / mo</th><th />
              </tr></thead>
              <tbody>
                {topSalons.map(b => (
                  <tr key={b.id}>
                    <td>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-[11.5px] text-fg-muted">{b.city}</p>
                    </td>
                    <td className="text-fg-2">{plans.find(p => p.id === b.plan)?.name}</td>
                    <td className="text-right text-fg-2">{b.branches.length}</td>
                    <td className="text-right font-semibold">{lakh(b.gmv)}</td>
                    <td className="text-right">
                      <Link to={`/dashboard/salons/${b.id}`} aria-label={`Open ${b.name}`} className="inline-flex text-fg-muted hover:text-fg"><ArrowRight size={15} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topSalons.length === 0 && <p className="p-5 text-[13px] text-fg-muted">No active salons yet.</p>}
        </Panel>
      </div>

      {rejecting && (
        <ReasonDialog title={`Reject ${rejecting.name}?`} subtitle="The owner sees this reason when they try to sign in."
          placeholder="e.g. Could not verify GST details" submitLabel="Reject request"
          onSubmit={reason => reject(rejecting.id, reason)} onClose={() => setRejecting(null)} />
      )}
    </div>
  )
}
