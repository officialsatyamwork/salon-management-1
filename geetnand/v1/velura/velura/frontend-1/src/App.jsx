import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import SetPasswordPage from './pages/auth/SetPasswordPage'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import AppointmentsPage from './pages/dashboard/AppointmentsPage'
import CustomersPage from './pages/dashboard/CustomersPage'
import BillingPage from './pages/dashboard/BillingPage'
import StaffPage from './pages/dashboard/StaffPage'
import ServicesPage from './pages/dashboard/ServicesPage'
import InventoryPage from './pages/dashboard/InventoryPage'
import MembershipPage from './pages/dashboard/MembershipPage'
import MarketingPage from './pages/dashboard/MarketingPage'
import ReportsPage from './pages/dashboard/ReportsPage'
import BranchesPage from './pages/dashboard/BranchesPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import { GuestOnly, RequireAuth, RequireModule } from './components/auth/ProtectedRoute'
import { useAuth } from './store/auth'

const modulePages = [
  ['appointments', AppointmentsPage],
  ['customers', CustomersPage],
  ['billing', BillingPage],
  ['staff', StaffPage],
  ['services', ServicesPage],
  ['inventory', InventoryPage],
  ['membership', MembershipPage],
  ['marketing', MarketingPage],
  ['reports', ReportsPage],
  ['branches', BranchesPage],
  ['settings', SettingsPage],
]

export default function App() {
  const bootstrap = useAuth(s => s.bootstrap)
  useEffect(() => { bootstrap() }, [bootstrap])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<SetPasswordPage mode="reset" />} />
        <Route path="/accept-invite" element={<SetPasswordPage mode="invite" />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            {modulePages.map(([key, Page]) => (
              <Route key={key} path={key} element={<RequireModule module={key}><Page /></RequireModule>} />
            ))}
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
