import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/auth'

export function RequireAuth() {
  const user = useAuth(s => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function GuestOnly({ children }) {
  const user = useAuth(s => s.user)
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export function RequireModule({ module, children }) {
  const allowed = useAuth(s => s.can(module))
  if (!allowed) return <Navigate to="/dashboard" replace />
  return children
}
