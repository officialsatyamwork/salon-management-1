import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Users, CreditCard, BarChart3, Package, Star,
  Bell, GitBranch, ArrowRight, Check, Zap, Shield,
  Clock, Smartphone, ChevronRight, Play, TrendingUp,
  MessageSquare, Gift, MapPin, FileText, RefreshCw, Lock
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const categories = [
  {
    id: 'appointments',
    icon: Calendar,
    label: 'Appointments',
    color: '#c4607a',
    title: 'Smart Appointment Management',
    tagline: 'Never miss a booking again',
    desc: 'A powerful calendar that works the way your salon does — drag, drop, and done.',
    features: [
      { icon: Calendar,      text: 'Drag-and-drop calendar with day, week & month views' },
      { icon: Bell,          text: 'Automated SMS & WhatsApp reminders to reduce no-shows' },
      { icon: Smartphone,    text: 'Customer self-booking via your branded booking page' },
      { icon: RefreshCw,     text: 'Recurring appointment scheduling for loyal clients' },
      { icon: Clock,         text: 'Waitlist management for fully-booked slots' },
      { icon: Users,         text: 'Multi-staff scheduling with conflict detection' },
    ],
    stat: { value: '60%', label: 'reduction in no-shows' },
  },
  {
    id: 'crm',
    icon: Users,
    label: 'Customer CRM',
    color: '#7c3aed',
    title: 'Know Every Customer Like Family',
    tagline: 'Build relationships that last',
    desc: 'Complete 360° profiles that help you personalise every visit and bring customers back.',
    features: [
      { icon: Users,         text: 'Complete profiles: visits, spend, preferences, notes' },
      { icon: Gift,          text: 'Birthday & anniversary auto-reminders with offers' },
      { icon: Star,          text: 'Loyalty points tracking and reward redemption' },
      { icon: TrendingUp,    text: 'Customer lifetime value and visit frequency analytics' },
      { icon: MessageSquare, text: 'Two-way messaging history per customer' },
      { icon: FileText,      text: 'Service history and stylist preference memory' },
    ],
    stat: { value: '3×', label: 'more repeat visits' },
  },
  {
    id: 'billing',
    icon: CreditCard,
    label: 'POS & Billing',
    color: '#c9973a',
    title: 'GST-Ready POS Built for Salons',
    tagline: 'Checkout in seconds, not minutes',
    desc: 'From walk-in to paid in under 30 seconds. Fully compliant, beautifully simple.',
    features: [
      { icon: CreditCard,    text: 'GST-ready invoices with automatic tax calculation' },
      { icon: Smartphone,    text: 'Cash, UPI, card — accept any payment method' },
      { icon: Users,         text: 'Split payments across multiple methods or customers' },
      { icon: Gift,          text: 'Discounts, coupons, and package redemptions' },
      { icon: RefreshCw,     text: 'Refund and credit note management' },
      { icon: FileText,      text: 'Digital invoice delivery via WhatsApp or email' },
    ],
    stat: { value: '₹1.2Cr+', label: 'processed daily' },
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory',
    color: '#059669',
    title: 'Never Run Out of Stock Again',
    tagline: 'Smart stock, zero wastage',
    desc: 'Real-time tracking from shelf to service so you always have exactly what you need.',
    features: [
      { icon: Package,       text: 'Real-time stock levels across all branches' },
      { icon: Bell,          text: 'Automatic low-stock alerts and reorder reminders' },
      { icon: Users,         text: 'Supplier contact and purchase order management' },
      { icon: BarChart3,     text: 'Usage reports to track product consumption' },
      { icon: GitBranch,     text: 'Inter-branch transfer and stock reconciliation' },
      { icon: FileText,      text: 'Product-wise profitability and margin tracking' },
    ],
    stat: { value: '35%', label: 'reduction in wastage' },
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    color: '#0891b2',
    title: 'Data That Drives Decisions',
    tagline: 'Know your numbers, grow your business',
    desc: 'Beautiful dashboards that turn your daily operations into actionable business insights.',
    features: [
      { icon: TrendingUp,    text: 'Revenue trends with day, week, and month breakdowns' },
      { icon: Users,         text: 'Staff performance: revenue, services, ratings' },
      { icon: Star,          text: 'Most popular services and peak hour analysis' },
      { icon: GitBranch,     text: 'Branch-wise consolidated reports' },
      { icon: CreditCard,    text: 'Payment method and outstanding dues tracking' },
      { icon: BarChart3,     text: 'Exportable reports for accounting and GST filing' },
    ],
    stat: { value: '40%', label: 'average revenue growth' },
  },
  {
    id: 'marketing',
    icon: Bell,
    label: 'Marketing',
    color: '#db2777',
    title: 'Automated Marketing That Actually Works',
    tagline: 'Reach customers where they are',
    desc: 'WhatsApp, SMS, email — set up once and let Keeng bring customers back on autopilot.',
    features: [
      { icon: MessageSquare, text: 'WhatsApp, SMS, and email campaigns' },
      { icon: Gift,          text: 'Birthday, anniversary, and win-back automations' },
      { icon: Users,         text: 'Audience segmentation by visit frequency or spend' },
      { icon: TrendingUp,    text: 'Open rate, click-through, and conversion tracking' },
      { icon: Bell,          text: 'Appointment reminder sequences' },
      { icon: Star,          text: 'Review request campaigns after service' },
    ],
    stat: { value: '5×', label: 'campaign ROI on average' },
  },
  {
    id: 'membership',
    icon: Star,
    label: 'Membership',
    color: '#ea580c',
    title: 'Memberships & Loyalty That Retain',
    tagline: 'Turn clients into superfans',
    desc: 'Prepaid packages, points, and tiers that keep your best customers coming back every time.',
    features: [
      { icon: Star,          text: 'Custom membership packages with validity and perks' },
      { icon: Gift,          text: 'Loyalty points earn-and-burn across services' },
      { icon: TrendingUp,    text: 'Tiered loyalty: Bronze, Silver, Gold, Platinum' },
      { icon: CreditCard,    text: 'Gift voucher creation and redemption' },
      { icon: Bell,          text: 'Membership expiry alerts and renewal reminders' },
      { icon: BarChart3,     text: 'Member revenue vs walk-in revenue analytics' },
    ],
    stat: { value: '2.8×', label: 'member spend vs non-member' },
  },
  {
    id: 'branches',
    icon: GitBranch,
    label: 'Multi-Branch',
    color: '#6d28d9',
    title: 'One Dashboard. Every Branch.',
    tagline: 'Scale without the chaos',
    desc: 'Manage unlimited locations as effortlessly as one. Centralized data, decentralized control.',
    features: [
      { icon: GitBranch,     text: 'Unlimited branches under a single dashboard' },
      { icon: Users,         text: 'Centralized customer database across all branches' },
      { icon: Lock,          text: 'Role-based access: branch manager vs owner view' },
      { icon: BarChart3,     text: 'Consolidated vs branch-wise P&L reporting' },
      { icon: Package,       text: 'Inter-branch inventory transfers' },
      { icon: MapPin,        text: 'Branch-specific services, pricing, and staff' },
    ],
    stat: { value: '100+', label: 'branches managed by one owner' },
  },
]

const highlights = [
  { icon: Zap,       title: '5-min Setup',       desc: 'Go live today — no IT team needed' },
  { icon: Shield,    title: 'Bank-grade Security', desc: 'Encrypted, isolated, always backed up' },
  { icon: Smartphone,title: 'Any Device',          desc: 'Desktop, tablet, or mobile' },
  { icon: Clock,     title: '24/7 Support',        desc: 'Real humans, always available' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
              Everything You Need
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
              One platform.<br />
              <span className="gradient-text">All the features.</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Replace 10 different tools with one platform built specifically for beauty and wellness.
              Every feature designed by listening to real salon owners.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white">
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <a href="#features-list" className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <Play size={15} /> Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick highlights */}
      <section className="py-10 px-6" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map(h => (
            <motion.div key={h.title} variants={fadeUp} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-soft)' }}>
                <h.icon size={16} style={{ color: 'var(--brand)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{h.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature categories */}
      <section id="features-list" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className={`grid md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Text side */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-5 text-xs font-semibold uppercase tracking-wider"
                  style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}30` }}>
                  <cat.icon size={13} />
                  {cat.label}
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                  {cat.title}
                </h2>
                <p className="text-sm font-semibold mb-4" style={{ color: cat.color }}>{cat.tagline}</p>
                <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{cat.desc}</p>

                <ul className="space-y-3 mb-8">
                  {cat.features.map(f => (
                    <li key={f.text} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${cat.color}18` }}>
                        <Check size={11} style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold transition-all"
                  style={{ color: cat.color }}>
                  Get started <ChevronRight size={15} />
                </Link>
              </div>

              {/* Visual side */}
              <div className="card p-8">
                {/* Big stat */}
                <div className="mb-8 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="text-5xl font-black mb-1" style={{ color: cat.color }}>{cat.stat.value}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cat.stat.label}</div>
                </div>

                {/* Feature list */}
                <div className="space-y-3">
                  {cat.features.slice(0, 4).map((f, i) => (
                    <motion.div
                      key={f.text}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'var(--surface)' }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${cat.color}18` }}>
                        <f.icon size={14} style={{ color: cat.color }} />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="card rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to try every <span className="gradient-text">feature free?</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              14-day free trial. All features unlocked. No credit card required.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg btn-primary text-white">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>Setup in 5 minutes · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
