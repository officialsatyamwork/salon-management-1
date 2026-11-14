import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search, Check, X, Inbox, Store } from 'lucide-react'
import { usePlatform, planPrice } from '../../store/platform'
import { StatusPill } from '../../components/dashboard/widgets'
import { inr } from '../../components/dashboard/chart'
import RowMenu from '../../components/ui/RowMenu'
import useSalonActions from '../../components/platform/useSalonActions'

const TABS = [
  ['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive'],
  ['suspended', 'Suspended'], ['pending', 'Requests'], ['rejected', 'Rejected'],
]

const joined = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function SalonsPage() {
  const businesses = usePlatform(s => s.businesses)
  const plans = usePlatform(s => s.plans)
  const approve = usePlatform(s => s.approve)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const tab = params.get('status') || 'all'
  const { itemsFor, dialogs, openCreate } = useSalonActions({
    startWithCreate: params.get('new') === '1',
    onCreated: id => navigate(`/dashboard/salons/${id}`),
  })

  const count = status => businesses.filter(b => status === 'all' ? b.status !== 'rejected' : b.status === status).length
  const q = query.trim().toLowerCase()
  const rows = businesses
    .filter(b => tab === 'all' ? b.status !== 'rejected' : b.status === tab)
    .filter(b => !q || [b.name, b.owner.name, b.owner.email, b.city].some(v => v.toLowerCase().includes(q)))
  const pending = businesses.filter(b => b.status === 'pending')

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold text-fg">Salon businesses</h2>
          <p className="text-[13px] text-fg-muted">Every salon on the platform, their plans and their status.</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2 rounded-xl text-[13px] flex items-center gap-1.5">
          <Plus size={15} /> Create salon
        </button>
      </div>

      {pending.length > 0 && tab !== 'pending' && (
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3" style={{ borderColor: 'rgba(245,158,11,0.35)' }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-500 flex-shrink-0"><Inbox size={17} /></span>
          <div className="flex-1 min-w-[200px]">
            <p className="text-[13.5px] font-semibold text-fg">{pending.length} registration request{pending.length > 1 ? 's' : ''} waiting</p>
            <p className="text-[12px] text-fg-muted truncate">{pending.map(b => b.name).join(', ')}</p>
          </div>
          <button onClick={() => setParams({ status: 'pending' })} className="btn-ghost px-3.5 py-2 rounded-xl text-[12.5px] font-medium">Review requests</button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setParams(key === 'all' ? {} : { status: key })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${tab === key ? 'bg-violet-600 text-white' : 'glass text-fg-2 hover:text-fg'}`}>
              {label}
              <span className={`text-[11px] px-1.5 rounded-md ${tab === key ? 'bg-white/20' : 'bg-fg/10'}`}>{count(key)}</span>
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search salon, owner, city…"
            className="w-full bg-fg/5 border border-line rounded-xl pl-9 pr-4 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-violet-500" />
        </div>
      </div>

      {tab === 'pending' ? (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map(b => (
            <div key={b.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <Link to={`/dashboard/salons/${b.id}`} className="text-[15px] font-semibold text-fg hover:underline">{b.name}</Link>
                  <p className="text-[12.5px] text-fg-muted">{b.type} · {b.city} · requested {joined(b.createdAt)}</p>
                </div>
                <StatusPill status="pending" />
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px] mb-4">
                <div><dt className="text-fg-muted">Owner</dt><dd className="text-fg font-medium">{b.owner.name}</dd></div>
                <div><dt className="text-fg-muted">Contact</dt><dd className="text-fg font-medium truncate">{b.owner.email}</dd></div>
                <div><dt className="text-fg-muted">Plan requested</dt><dd className="text-fg font-medium">{plans.find(p => p.id === b.plan)?.name}</dd></div>
                <div><dt className="text-fg-muted">Branches planned</dt><dd className="text-fg font-medium">{b.branches.length || 1}</dd></div>
              </dl>
              {b.requestNote && <p className="text-[12.5px] text-fg-2 p-3 rounded-xl bg-fg/[0.04] mb-4">“{b.requestNote}”</p>}
              <div className="flex gap-2">
                <button onClick={() => approve(b.id)}
                  className="flex-1 py-2 rounded-xl text-[13px] font-medium bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1.5 transition-colors">
                  <Check size={15} /> Approve
                </button>
                <button onClick={itemsFor(b).find(i => i.label === 'Reject').onClick}
                  className="flex-1 py-2 rounded-xl text-[13px] font-medium border border-line text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition-colors">
                  <X size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[860px] whitespace-nowrap data-table">
            <thead><tr>
              <th className="text-left">Salon</th><th className="text-left">City</th><th className="text-left">Plan</th>
              <th className="text-right">Branches</th><th className="text-right">Staff</th><th className="text-right">Subscription</th>
              <th className="text-left">Status</th><th className="text-left">Joined</th><th />
            </tr></thead>
            <tbody>
              {rows.map(b => (
                <tr key={b.id}>
                  <td>
                    <Link to={`/dashboard/salons/${b.id}`} className="flex items-center gap-3 group">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                        style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>{b.name[0]}</span>
                      <span>
                        <span className="block font-semibold group-hover:underline">{b.name}</span>
                        <span className="block text-[11.5px] text-fg-muted">{b.owner.name} · {b.owner.email}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="text-fg-2">{b.city}</td>
                  <td className="text-fg-2">{plans.find(p => p.id === b.plan)?.name}</td>
                  <td className="text-right text-fg-2">{b.branches.length}</td>
                  <td className="text-right text-fg-2">{b.branches.reduce((s, br) => s + br.staff, 0)}</td>
                  <td className="text-right font-medium">{b.status === 'active' ? `${inr.format(planPrice(plans, b.plan))}/mo` : '—'}</td>
                  <td><StatusPill status={b.status} /></td>
                  <td className="text-fg-muted">{joined(b.createdAt)}</td>
                  <td className="text-right"><RowMenu items={itemsFor(b)} label={`Actions for ${b.name}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && (
        <div className="glass rounded-2xl py-14 text-center">
          <Store size={26} className="mx-auto mb-2 text-fg-muted" />
          <p className="text-[14px] font-semibold text-fg">No salons here</p>
          <p className="text-[12.5px] text-fg-muted">{q ? 'Try a different search.' : 'Nothing matches this filter yet.'}</p>
        </div>
      )}

      {dialogs}
    </div>
  )
}
