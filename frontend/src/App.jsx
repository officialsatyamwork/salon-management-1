import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import AboutPage from './pages/landing/AboutPage'
import FeaturesPage from './pages/landing/FeaturesPage'
import SolutionsPage from './pages/landing/SolutionsPage'
import PricingPage from './pages/landing/PricingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
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
import CalendarPage from './pages/dashboard/CalendarPage'
import BranchDashboardPage from './pages/dashboard/BranchDashboardPage'
import SalonsPage from './pages/platform/SalonsPage'
import SalonDetailPage from './pages/platform/SalonDetailPage'
import PlansPage from './pages/platform/PlansPage'
import PlatformSettingsPage from './pages/platform/PlatformSettingsPage'
import { GuestOnly, RequireAuth, RequireModule } from './components/auth/ProtectedRoute'

const modulePages = [
  ['appointments', AppointmentsPage],
  ['calendar', CalendarPage],
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
  ['salons', SalonsPage],
  ['salons/:id', SalonDetailPage, 'salons'],
  ['plans', PlansPage],
  ['platform-settings', PlatformSettingsPage],
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            {modulePages.map(([path, Page, module = path]) => (
              <Route key={path} path={path} element={<RequireModule module={module}><Page /></RequireModule>} />
            ))}
            <Route path="branches/:branchId" element={<BranchDashboardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
