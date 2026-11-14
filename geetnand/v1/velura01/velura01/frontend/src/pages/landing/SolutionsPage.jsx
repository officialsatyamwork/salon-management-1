import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Scissors, Sparkles, Heart, Brush, Leaf, Zap,
  Check, ArrowRight, ChevronRight, Star, Users,
  Calendar, CreditCard, Bell, BarChart3, GitBranch, Package
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const solutions = [
  {
    id: 'salons',
    icon: Scissors,
    color: '#c4607a',
    label: 'Hair Salons',
    headline: 'Built for Salons, Inside and Out',
    desc: 'From a single chair to a full-floor salon — Keeng handles bookings, billing, inventory, and staff so you can focus on the cut.',
    challenges: [
      'Walk-ins clashing with appointments',
      'Tracking stylist commission manually',
      'Running out of products mid-service',
      'Keeping customers coming back',
    ],
    howWeHelp: [
      { icon: Calendar,    text: 'Real-time chair availability and smart scheduling' },
      { icon: CreditCard,  text: 'Auto commission calculation per service and stylist' },
      { icon: Package,     text: 'Product usage tracking linked to each appointment' },
      { icon: Bell,        text: 'Automated WhatsApp reminders and follow-ups' },
      { icon: Star,        text: 'Loyalty points and birthday offers to retain clients' },
      { icon: BarChart3,   text: 'Daily revenue, stylist performance, and service reports' },
    ],
    testimonial: {
      text: 'Keeng cut our no-shows by 60% and our stylist commission disputes dropped to zero. Best investment we made.',
      name: 'Priya Sharma',
      role: 'Owner, Glow Salon, Mumbai',
    },
    stat1: { value: '60%', label: 'fewer no-shows' },
    stat2: { value: '35%', label: 'revenue growth' },
  },
  {
    id: 'spas',
    icon: Leaf,
    color: '#059669',
    label: 'Spas & Wellness',
    headline: 'Manage the Calm, Not the Chaos',
    desc: 'Spas run on atmosphere and precision. Keeng keeps your schedules airtight and your guests feeling taken care of from the first booking.',
    challenges: [
      'Double-booking treatment rooms',
      'Managing therapist availability and breaks',
      'Tracking membership packages and sessions',
      'Coordinating retail product sales with services',
    ],
    howWeHelp: [
      { icon: Calendar,    text: 'Room and therapist-aware scheduling to prevent conflicts' },
      { icon: Star,        text: 'Membership and prepaid package tracking per guest' },
      { icon: Users,       text: 'Guest preference notes (pressure, allergies, preferences)' },
      { icon: CreditCard,  text: 'Bundle packages and retail products in one invoice' },
      { icon: Bell,        text: 'Session expiry reminders to increase package renewal' },
      { icon: BarChart3,   text: 'Treatment room utilization and therapist revenue reports' },
    ],
    testimonial: {
      text: 'Our therapists used to spend 30 minutes on admin every morning. With Keeng, their day starts the moment the first guest arrives.',
      name: 'Rahul Mehta',
      role: 'Manager, Zen Spa, Bangalore',
    },
    stat1: { value: '30 min', label: 'saved per staff per day' },
    stat2: { value: '2.8×', label: 'member renewal rate' },
  },
  {
    id: 'clinics',
    icon: Heart,
    color: '#db2777',
    label: 'Beauty Clinics',
    headline: 'Clinical Precision, Salon Simplicity',
    desc: 'Aesthetic clinics need more than a booking tool — they need patient records, treatment tracking, and compliance. Keeng delivers all three.',
    challenges: [
      'Tracking treatment plans across multiple sessions',
      'Maintaining patient consultation notes',
      'Managing high-value service packages',
      'Staff managing multiple procedure rooms',
    ],
    howWeHelp: [
      { icon: Users,       text: 'Detailed patient profiles with treatment history and notes' },
      { icon: Calendar,    text: 'Procedure room and practitioner scheduling' },
      { icon: Star,        text: 'High-value package tracking and session deductions' },
      { icon: CreditCard,  text: 'GST-ready invoicing with procedure codes' },
      { icon: Bell,        text: 'Post-treatment care reminders and follow-up scheduling' },
      { icon: BarChart3,   text: 'Treatment-wise revenue and practitioner performance' },
    ],
    testimonial: {
      text: 'Finally a software that understands the beauty industry. The loyalty program has brought back so many customers.',
      name: 'Anita Nair',
      role: 'Owner, Aura Wellness, Chennai',
    },
    stat1: { value: '98%', label: 'patient satisfaction' },
    stat2: { value: '45%', label: 'package renewal rate' },
  },
  {
    id: 'studios',
    icon: Brush,
    color: '#7c3aed',
    label: 'Makeup & Bridal Studios',
    headline: 'From First Trial to Wedding Day',
    desc: 'Bridal bookings are months in advance and require coordination across artists, trials, and events. Keeng keeps every detail in place.',
    challenges: [
      'Managing bookings months ahead with deposits',
      'Coordinating trials and event-day timelines',
      'Tracking advance payments and balances',
      'Communicating changes to clients in real time',
    ],
    howWeHelp: [
      { icon: Calendar,    text: 'Long-horizon booking with trial and event milestones' },
      { icon: CreditCard,  text: 'Deposit and advance payment tracking per booking' },
      { icon: Users,       text: 'Bridal party coordination — multiple guests, one booking' },
      { icon: Bell,        text: 'WhatsApp reminders for each milestone and balance dues' },
      { icon: Star,        text: 'Portfolio and service menu with pricing tiers' },
      { icon: BarChart3,   text: 'Seasonal booking trends and peak month forecasting' },
    ],
    testimonial: {
      text: 'Bridal season used to feel like juggling 50 things. Now it feels like I just have to show up and do the work I love.',
      name: 'Kavitha Reddy',
      role: 'Owner, Blush Bridal Studio, Hyderabad',
    },
    stat1: { value: '0', label: 'missed bookings last season' },
    stat2: { value: '4.9★', label: 'average client rating' },
  },
  {
    id: 'chains',
    icon: GitBranch,
    color: '#0891b2',
    label: 'Salon Chains & Franchises',
    headline: 'One View. Every Branch.',
    desc: 'Managing 5+ locations shouldn\'t mean 5× the work. Keeng gives you centralised control with the flexibility each branch needs.',
    challenges: [
      'Inconsistent service quality across branches',
      'No visibility into individual branch performance',
      'Managing customers who visit multiple branches',
      'Keeping pricing and services consistent',
    ],
    howWeHelp: [
      { icon: GitBranch,   text: 'All branches under one dashboard, one login' },
      { icon: Users,       text: 'Customer data synced across branches automatically' },
      { icon: BarChart3,   text: 'Branch-wise and consolidated P&L in real time' },
      { icon: Package,     text: 'Centralized inventory with inter-branch transfer' },
      { icon: Star,        text: 'Standardized service menus with branch-level overrides' },
      { icon: Bell,        text: 'Franchise-wide marketing campaigns from one place' },
    ],
    testimonial: {
      text: 'I went from 2 hours of daily reporting across branches to a 2-minute glance at my Keeng dashboard.',
      name: 'Suresh Nambiar',
      role: 'Director, Flair Salons (8 branches), Kerala',
    },
    stat1: { value: '8', label: 'branches, 1 dashboard' },
    stat2: { value: '2 hrs', label: 'admin saved daily' },
  },
  {
    id: 'independent',
    icon: Sparkles,
    color: '#ea580c',
    label: 'Independent Stylists',
    headline: 'Run Your Freelance Business Like a Pro',
    desc: 'Solo but serious. Keeng gives independent stylists the same professional tools big salons use — at a price that makes sense for one person.',
    challenges: [
      'Managing bookings from multiple channels',
      'Sending reminders manually via WhatsApp',
      'Tracking income and generating invoices',
      'Building a loyal client base',
    ],
    howWeHelp: [
      { icon: Calendar,    text: 'Your own branded booking link to share on Instagram' },
      { icon: Bell,        text: 'Auto-reminders so you never chase a client again' },
      { icon: CreditCard,  text: 'Professional GST invoices in one tap' },
      { icon: Star,        text: 'Loyalty program to reward your best regulars' },
      { icon: Users,       text: 'Complete client history to deliver a personal experience' },
      { icon: BarChart3,   text: 'Monthly income summary and top services report' },
    ],
    testimonial: {
      text: 'I work alone but Keeng makes me look and feel like a full-on business. My clients love the reminder messages.',
      name: 'Deepa Krishnan',
      role: 'Independent Stylist, Pune',
    },
    stat1: { value: '₹999', label: 'per month, all inclusive' },
    stat2: { value: '5 min', label: 'to get started' },
  },
]

const bizTypes = [
  { label: 'Hair Salons',       icon: Scissors,  color: '#c4607a', href: '#salons'      },
  { label: 'Spas & Wellness',   icon: Leaf,      color: '#059669', href: '#spas'        },
  { label: 'Beauty Clinics',    icon: Heart,     color: '#db2777', href: '#clinics'     },
  { label: 'Makeup Studios',    icon: Brush,     color: '#7c3aed', href: '#studios'     },
  { label: 'Salon Chains',      icon: GitBranch, color: '#0891b2', href: '#chains'      },
  { label: 'Solo Stylists',     icon: Sparkles,  color: '#ea580c', href: '#independent' },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
              Built for Every Business
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
              The right fit for <br />
              <span className="gradient-text">your business type</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Whether you're a solo stylist or a 20-branch chain, Keeng adapts to how you work —
              not the other way around.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business type quick nav */}
      <section className="pb-16 px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {bizTypes.map(b => (
            <motion.a key={b.label} href={b.href} variants={fadeUp}
              className="card p-4 text-center cursor-pointer hover:scale-[1.03] transition-transform">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${b.color}18` }}>
                <b.icon size={17} style={{ color: b.color }} />
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{b.label}</p>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* Solution sections */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-28">
          {solutions.map((sol, idx) => (
            <motion.div
              key={sol.id}
              id={sol.id}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className={`grid md:grid-cols-2 gap-14 items-start ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Left: text */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-5 text-xs font-semibold uppercase tracking-wider"
                  style={{ background: `${sol.color}18`, color: sol.color, border: `1px solid ${sol.color}30` }}>
                  <sol.icon size={13} />
                  {sol.label}
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                  {sol.headline}
                </h2>
                <p className="leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>{sol.desc}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[sol.stat1, sol.stat2].map(s => (
                    <div key={s.label} className="card p-4 text-center">
                      <div className="text-2xl font-black mb-1" style={{ color: sol.color }}>{s.value}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="card p-5 mb-8">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--text-secondary)' }}>
                    "{sol.testimonial.text}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{sol.testimonial.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sol.testimonial.role}</p>
                  </div>
                </div>

                <Link to="/register" className="inline-flex items-center gap-2 font-semibold text-sm transition-all"
                  style={{ color: sol.color }}>
                  Try Keeng for {sol.label} <ChevronRight size={15} />
                </Link>
              </div>

              {/* Right: challenges + solutions */}
              <div className="space-y-6">
                {/* Pain points */}
                <div className="card p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                    Common Challenges
                  </h3>
                  <ul className="space-y-3">
                    {sol.challenges.map(c => (
                      <li key={c} className="flex items-start gap-3">
                        <span className="w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5"
                          style={{ borderColor: 'var(--border)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How Keeng helps */}
                <div className="card p-6" style={{ borderColor: `${sol.color}30` }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: sol.color }}>
                    How Keeng Helps
                  </h3>
                  <ul className="space-y-3">
                    {sol.howWeHelp.map(h => (
                      <li key={h.text} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${sol.color}18` }}>
                          <Check size={11} style={{ color: sol.color }} />
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{h.text}</span>
                      </li>
                    ))}
                  </ul>
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
              Sounds like <span className="gradient-text">your business?</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start your free 14-day trial. No credit card, no commitment. Just results.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg btn-primary text-white">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>All features unlocked · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
