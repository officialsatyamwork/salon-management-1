import { Navigate, useParams } from 'react-router-dom'
import { useScope } from '../../store/auth'
import BranchDashboard from './home/BranchDashboard'

// Owners can open any of their branches; managers only the ones they are
// assigned to or have been granted.
export default function BranchDashboardPage() {
  const { branchId } = useParams()
  const { user, business, branches } = useScope()
  const branch = branches.find(b => b.id === branchId)
  if (!['owner', 'manager'].includes(user.role) || !branch) return <Navigate to="/dashboard" replace />
  return <BranchDashboard key={branch.id} user={user} business={business} branch={branch} switchable={branches} />
}
