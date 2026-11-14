import { Store } from 'lucide-react'
import { useAuth, useScope } from '../../store/auth'
import PlatformDashboard from './home/PlatformDashboard'
import OwnerDashboard from './home/OwnerDashboard'
import BranchDashboard from './home/BranchDashboard'
import EmployeeDashboard from './home/EmployeeDashboard'

function Unavailable({ title, text }) {
  const logout = useAuth(s => s.logout)
  return (
    <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto mt-10">
      <Store size={26} className="mx-auto mb-3 text-fg-muted" />
      <h2 className="text-[18px] font-bold text-fg mb-1">{title}</h2>
      <p className="text-[13px] text-fg-2 mb-5">{text}</p>
      <button onClick={logout} className="btn-ghost px-4 py-2 rounded-xl text-[13px] font-medium">Sign out</button>
    </div>
  )
}

export default function DashboardHome() {
  const { user, business, branches } = useScope()

  if (user.role === 'super-admin') return <PlatformDashboard user={user} />
  if (!business) return <Unavailable title="Salon not found" text="This salon account no longer exists. Contact Keeng support." />
  if (user.role === 'owner') return <OwnerDashboard user={user} business={business} />
  if (!branches.length) return <Unavailable title="No branch assigned" text={`Ask the owner of ${business.name} to assign you to a branch.`} />
  if (user.role === 'manager') {
    const home = branches.find(b => b.manager.email === user.email) || branches[0]
    return <BranchDashboard key={home.id} user={user} business={business} branch={home} switchable={branches} />
  }
  return <EmployeeDashboard user={user} business={business} branch={branches[0]} />
}
