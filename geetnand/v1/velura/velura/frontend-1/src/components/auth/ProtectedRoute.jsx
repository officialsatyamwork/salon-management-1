import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../../store/auth'

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0e18' }}>
      <div className="w-8 h-8 rounded-full border-2 border-white/10 animate-spin" style={{ borderTopColor: '#c9973a' }} />
    </div>
  )
}

// Signed-in users only; others go to /login and come back afterwards.
export function RequireAuth() {
  const status = useAuth(s => s.status)
  const location = useLocation()
  if (status === 'loading') return <FullPageSpinner />
  if (status !== 'authed') return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// Pages for guests only (login, register): signed-in users go to the dashboard.
export function GuestOnly({ children }) {
  const status = useAuth(s => s.status)
  if (status === 'loading') return <FullPageSpinner />
  if (status === 'authed') return <Navigate to="/dashboard" replace />
  return children
}

// Hides a page from roles that may not use that module. The API enforces the same rule.
export function RequireModule({ module, children }) {
  const allowed = useAuth(s => s.user?.modules?.includes(module))
  if (!allowed) {
    return (
      <div className="glass rounded-2xl p-10 text-center max-w-md mx-auto mt-10">
        <Lock size={28} className="mx-auto mb-3 text-gray-500" />
        <p className="text-white font-semibold mb-1">You don't have access to this page</p>
        <p className="text-gray-500 text-sm">Ask your salon owner if you need it.</p>
      </div>
    )
  }
  return children
}
