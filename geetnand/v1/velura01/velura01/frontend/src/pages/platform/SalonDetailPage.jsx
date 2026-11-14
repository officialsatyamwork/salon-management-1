import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, LogIn, Pencil, GitBranch, Users, IndianRupee, Crown, UserRound, Star, Check, X, AlertTriangle } from 'lucide-react'
import { usePlatform } from '../../store/platform'
import { useAuth } from '../../store/auth'
import { Panel, StatCard, StatusPill, Meter } from '../../components/dashboard/widgets'
import { inr, lakh } from '../../components/dashboard/chart'
import { Modal, ModalActions, Select } from '../../components/ui/Modal'
import RowMenu from '../../components/ui/RowMenu'
import ActivityFeed from '../../components/platform/ActivityFeed'
import useSalonActions from '../../components/platform/useSalonActions'

const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// Next billing date: the signup day of the month, on or after today.
function renewal(createdAt, now) {
  const day = new Date(createdAt).getDate()
  const next = new Date(now.getFullYear(), now.getMonth(), day)
  if (next < now) next.setMonth(next.getMonth() + 1)
  return fmtDate(next)
}

export default function SalonDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const business = usePlatform(s => s.businesses.find(b => b.id === id))
  const plans = usePlatform(s => s.plans)
  const activity = usePlatform(s => s.activity)
  const approve = usePlatform(s => s.approve)
  const changePlan = usePlatform(s => s.changePlan)
  const impersonate = useAuth(s => s.impersonate)
  const recordAccess = usePlatform(s => s.recordAccess)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [now] = useState(() => new Date())
  const { itemsFor, dialogs } = useSalonActions({ onDeleted: () => navigate('/dashboard/salons') })

  if (!business) return <Navigate to="/dashboard/salons" replace />

  const plan = plans.find(p => p.id === business.plan)
  const staff = business.branches.reduce((s, b) => s + b.staff, 0)
  const gmv = business.branches.reduce((s, b) => s + b.revenueMonth, 0)
  const items = itemsFor(business)
  const editItem = items.find(i => i.label === 'Edit details')
  const menuItems = items.filter(i => i !== editItem && i.label !== 'Approve')
  const history = activity.filter(a => a.text.includes(business.name)).slice(0, 6)

  const openDashboard = () => {
    recordAccess(business.id)
    impersonate(business)
    navigate('/dashboard')
  }

  return (
    <div className="space-y-5 page-enter">
      <Link to="/dashboard/salons" className="inline-flex items-center gap-1.5 text-[13px] text-fg-2 hover:text-fg">
        <ArrowLeft size={15} /> All salons
      </Link>

      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-start gap-4">
        <span className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0"
          style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>{business.name[0]}</span>
        <div className="flex-1 min-w-[220px]">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[22px] font-bold text-fg leading-tight">{business.name}</h2>
            <StatusPill status={business.status} />
          </div>
          <p className="text-[13px] text-fg-muted mt-1">
            {business.type} · {business.city} · {business.status === 'pending' ? 'requested' : 'joined'} {fmtDate(business.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={editItem.onClick} className="btn-ghost px-3.5 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5">
            <Pencil size={14} /> Edit
          </button>
          <button onClick={() => setConfirmOpen(true)} disabled={business.status !== 'active'}
            title={business.status !== 'active' ? 'Only active salons can be opened' : undefined}
            className="btn-primary px-3.5 py-2 rounded-xl text-[13px] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <LogIn size={14} /> Open salon dashboard
          </button>
          <RowMenu items={menuItems} label="More actions" />
        </div>
      </div>

      {business.status === 'pending' && (
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3" style={{ borderColor: 'rgba(245,158,11,0.35)' }}>
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
          <p className="flex-1 min-w-[200px] text-[13px] text-fg">
            This salon is waiting for approval. {business.requestNote && <span className="text-fg-2">“{business.requestNote}”</span>}
          </p>
          <button onClick={() => approve(business.id)} className="px-3.5 py-2 rounded-xl text-[13px] font-medium bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5"><Check size={14} /> Approve</button>
          <button onClick={items.find(i => i.label === 'Reject').onClick} className="px-3.5 py-2 rounded-xl text-[13px] font-medium border border-line text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"><X size={14} /> Reject</button>
        </div>
      )}
      {business.statusNote && business.status !== 'active' && business.status !== 'pending' && (
        <div className="glass rounded-2xl p-4 flex items-center gap-3 text-[13px]" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={17} className="text-red-400 flex-shrink-0" />
          <span className="text-fg"><span className="font-semibold capitalize">{business.status}:</span> <span className="text-fg-2">{business.statusNote}</span></span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={GitBranch} label="Branches" value={`${business.branches.length} / ${plan?.maxBranches}`} change={`${plan?.name} limit`} trend="neutral" tone="cyan" />
        <StatCard icon={Users} label="Staff" value={staff} change={`${business.branches.length} managers`} trend="neutral" tone="blue" delay={0.05} />
        <StatCard icon={IndianRupee} label="Revenue processed / mo" value={lakh(gmv)} change={gmv ? '+8.2%' : 'No sales yet'} trend={gmv ? 'up' : 'neutral'} tone="violet" delay={0.1} />
        <StatCard icon={Crown} label="Subscription" value={business.status === 'active' ? `${inr.format(plan?.price || 0)}` : '—'} change="per month" trend="neutral" tone="gold" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Business information" subtitle="As registered on Keeng">
          <dl className="space-y-3 text-[13px]">
            {[
              ['Owner', business.owner.name], ['Email', business.owner.email], ['Phone', business.owner.phone],
              ['Address', business.address], ['GSTIN', business.gstin || 'Not provided'], ['Customers', business.customers.toLocaleString('en-IN')],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-fg-muted flex-shrink-0">{k}</dt>
                <dd className="text-fg font-medium text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Subscription" subtitle={business.status === 'active' ? `Renews on ${renewal(business.createdAt, now)}` : 'Not billing while the salon is not active'} delay={0.25}>
          <Select value={business.plan} onChange={e => changePlan(business.id, e.target.value)} aria-label="Subscription plan">
            {plans.filter(p => p.active || p.id === business.plan).map(p => (
              <option key={p.id} value={p.id}>{p.name} · ₹{p.price.toLocaleString('en-IN')}/mo</option>
            ))}
          </Select>
          <div className="mt-4 space-y-3.5">
            {[['Branches', business.branches.length, plan?.maxBranches], ['Staff seats', staff, plan?.maxStaff]].map(([k, used, max]) => (
              <div key={k}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-fg-2">{k}</span>
                  <span className={`font-semibold ${used > max ? 'text-red-400' : 'text-fg'}`}>{used} / {max}</span>
                </div>
                <Meter value={used} max={max} tone={used > max ? 'red' : used / max > 0.8 ? 'amber' : 'rose'} />
              </div>
            ))}
            {business.branches.length > (plan?.maxBranches || 0) && (
              <p className="text-[12px] text-red-400">Over the plan's branch limit. Move them to a bigger plan.</p>
            )}
          </div>
          <p className="text-[12px] text-fg-muted mt-4">{plan?.features.join(' · ')}</p>
        </Panel>

        <Panel title="Recent activity" subtitle="For this salon" delay={0.3}>
          {history.length ? <ActivityFeed items={history} /> : <p className="text-[13px] text-fg-muted">Nothing recorded yet.</p>}
        </Panel>
      </div>

      <Panel title="Branches" subtitle={`${business.branches.length} location${business.branches.length === 1 ? '' : 's'}`} bodyClassName="" delay={0.35}>
        {business.branches.length === 0 ? (
          <p className="px-5 pb-5 text-[13px] text-fg-muted">This salon hasn't added any branches yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] whitespace-nowrap data-table">
              <thead><tr>
                <th className="text-left">Branch</th><th className="text-left">Manager</th><th className="text-right">Staff</th>
                <th className="text-right">Revenue / mo</th><th className="text-right">Rating</th><th className="text-left">Status</th>
              </tr></thead>
              <tbody>
                {business.branches.map(b => (
                  <tr key={b.id}>
                    <td><p className="font-medium">{b.name}</p><p className="text-[11.5px] text-fg-muted">{b.address}, {b.city}</p></td>
                    <td className="text-fg-2"><span className="flex items-center gap-1.5"><UserRound size={13} />{b.manager.name}</span></td>
                    <td className="text-right text-fg-2">{b.staff}</td>
                    <td className="text-right font-medium">{b.revenueMonth ? lakh(b.revenueMonth) : '—'}</td>
                    <td className="text-right">{b.rating ? <span className="inline-flex items-center gap-1"><Star size={12} className="text-amber-500" fill="currentColor" />{b.rating}</span> : '—'}</td>
                    <td><StatusPill status={b.status === 'active' && business.status === 'pending' ? 'pending' : b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {confirmOpen && (
        <Modal title={`Open ${business.name}'s dashboard?`} subtitle={`You'll see exactly what ${business.owner.name} sees. A banner at the top takes you back to the platform.`} onClose={() => setConfirmOpen(false)}>
          <form onSubmit={e => { e.preventDefault(); openDashboard() }}>
            <p className="text-[13px] text-fg-2 mb-4">Use this to help the salon with support requests. Your visit is recorded in the activity log.</p>
            <ModalActions onCancel={() => setConfirmOpen(false)} submitLabel="Open dashboard" />
          </form>
        </Modal>
      )}
      {dialogs}
    </div>
  )
}
