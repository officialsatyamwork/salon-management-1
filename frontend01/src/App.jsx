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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
