import { Store, GitBranch, Crown, ShieldAlert, CheckCircle2, XCircle, Users, Trash2, Pencil, Settings, Inbox, LogIn } from 'lucide-react'
import { TONES } from '../dashboard/chart'

const TYPES = {
  request: [Inbox, 'amber'],
  approve: [CheckCircle2, 'green'],
  reject: [XCircle, 'red'],
  create: [Store, 'violet'],
  edit: [Pencil, 'blue'],
  branch: [GitBranch, 'cyan'],
  plan: [Crown, 'gold'],
  status: [ShieldAlert, 'red'],
  team: [Users, 'blue'],
  delete: [Trash2, 'red'],
  settings: [Settings, 'gray'],
  access: [LogIn, 'violet'],
}

const when = iso => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export default function ActivityFeed({ items }) {
  return (
    <ol className="space-y-3">
      {items.map(a => {
        const [Icon, tone] = TYPES[a.type] || TYPES.edit
        return (
          <li key={a.id} className="flex gap-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${TONES[tone]}1f`, color: TONES[tone] }}>
              <Icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-fg leading-snug">{a.text}</p>
              <p className="text-[11.5px] text-fg-muted mt-0.5">{when(a.at)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
