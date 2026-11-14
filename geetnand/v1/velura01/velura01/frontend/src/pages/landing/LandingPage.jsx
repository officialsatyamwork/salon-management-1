import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Users, CreditCard, BarChart3, Package, Star,
  Bell, GitBranch, ArrowRight, Check, ChevronDown, Zap,
  Shield, Globe, TrendingUp, Clock, Smartphone, MessageSquare
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import HeroSection from '../../components/hero/HeroSection'
import '../../components/hero/hero.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const features = [
  { icon: Calendar, title: 'Smart Appointments', desc: 'Drag-and-drop calendar with daily, weekly, monthly views. Auto-reminders and no-show tracking.' },
  { icon: Users, title: 'Customer CRM', desc: 'Complete customer profiles, visit history, preferences, birthday reminders, and loyalty tracking.' },
  { icon: CreditCard, title: 'POS & Billing', desc: 'GST-ready invoicing, multiple payment methods, split payments, discounts, and refunds.' },
  { icon: Package, title: 'Inventory Control', desc: 'Real-time stock tracking, low-stock alerts, supplier management, and usage reports.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Revenue charts, staff performance, popular services, and branch-wise consolidated reports.' },
  { icon: Bell, title: 'Marketing Automation', desc: 'WhatsApp, SMS, and email campaigns. Birthday offers, retention campaigns, and follow-ups.' },
  { icon: Star, title: 'Membership & Loyalty', desc: 'Prepaid packages, loyalty points, gift vouchers, and membership expiry tracking.' },
  { icon: GitBranch, title: 'Multi-Branch', desc: 'Manage all branches from one dashboard with centralized customer data and reports.' },
]

const stats = [
  { value: '10,000+', label: 'Businesses Trust Us' },
  { value: '2.5M+', label: 'Appointments Booked' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '40%', label: 'Revenue Growth' },
]

const plans = [
  {
    name: 'Starter', price: '₹999', period: '/month',
    desc: 'Perfect for single-location businesses',
    features: ['1 Branch', 'Up to 3 Staff', 'Appointments & Billing', 'Basic Reports', 'Email Support'],
    cta: 'Start Free Trial', highlight: false
  },
  {
    name: 'Growth', price: '₹2,499', period: '/month',
    desc: 'For growing salons and spas',
    features: ['3 Branches', 'Up to 15 Staff', 'All Core Modules', 'CRM & Loyalty', 'WhatsApp Notifications', 'Advanced Reports', 'Priority Support'],
    cta: 'Start Free Trial', highlight: true
  },
  {
    name: 'Enterprise', price: 'Custom', period: '',
    desc: 'For large chains and franchises',
    features: ['Unlimited Branches', 'Unlimited Staff', 'All Modules', 'Custom Integrations', 'Dedicated Manager', 'SLA Support', 'White Label Option'],
    cta: 'Contact Sales', highlight: false
  },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Owner, Glow Salon, Mumbai', text: 'Keeng transformed how we manage our 3 branches. Appointments, billing, and staff — all in one place. Revenue up 35% in 3 months.' },
  { name: 'Rahul Mehta', role: 'Manager, Zen Spa, Bangalore', text: 'The automated reminders alone reduced our no-shows by 60%. The dashboard is beautiful and incredibly easy to use.' },
  { name: 'Anita Nair', role: 'Owner, Aura Wellness, Chennai', text: 'Finally a software that understands the beauty industry. The loyalty program has brought back so many customers.' },
]

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes, all plans come with a 14-day free trial. No credit card required.' },
  { q: 'Can I manage multiple branches?', a: 'Yes, our Growth and Enterprise plans support multiple branches with centralized management.' },
  { q: 'Does it support GST billing?', a: 'Yes, Keeng is fully GST-compliant with automatic tax calculation and invoice generation.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption and each business has completely isolated data.' },
  { q: 'Can customers book online?', a: 'Yes, customers get a branded booking page to schedule appointments 24/7.' },
]

const benefits = [
  { icon: Zap,        title: 'Lightning Fast Setup',  desc: 'Go live in under 5 minutes. No technical knowledge required.' },
  { icon: Shield,     title: 'Enterprise Security',   desc: 'Bank-grade encryption with complete data isolation per business.' },
  { icon: Smartphone, title: 'Works on Any Device',   desc: 'Fully responsive — desktop, tablet, and mobile.' },
  { icon: Globe,      title: 'Multi-Branch Ready',    desc: 'Scale from 1 to 100+ branches without changing your workflow.' },
  { icon: TrendingUp, title: 'Grow Revenue',          desc: 'Automated marketing and loyalty programs bring customers back.' },
  { icon: Clock,      title: '24/7 Support',          desc: 'Dedicated support team available whenever you need help.' },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />
      <HeroSection />

      {/* Stats */}
      <section className="py-20 px-6" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
              <p className="text-4xl font-black gradient-text mb-2">{s.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
              One Platform. <span className="gradient-text">All Features.</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Replace 10 different tools with one powerful platform built specifically for beauty and wellness businesses.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="card p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--brand-soft)' }}>
                  <f.icon size={20} style={{ color: 'var(--brand)' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up and set up your business profile, branches, services, and staff in minutes.' },
              { step: '02', title: 'Configure Your Business', desc: 'Add your services, set pricing, configure staff schedules, and customize your booking page.' },
              { step: '03', title: 'Start Managing', desc: 'Accept bookings, process payments, track performance, and grow your business.' },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.15 }} className="text-center">
                <div className="text-6xl font-black mb-4" style={{ color: 'var(--brand-soft)', WebkitTextFillColor: 'var(--brand)', opacity: 0.2 }}>{item.step}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Built for <span className="gradient-text">Every Business</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Salons', 'Spas', 'Beauty Clinics', 'Hair Studios', 'Wellness Centres', 'Tattoo Studios'].map((biz, i) => (
              <motion.div key={biz} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-4 text-center cursor-pointer">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{biz}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-8" style={{ color: 'var(--text-primary)' }}>
              Why Businesses <span className="gradient-text">Choose Keeng</span>
            </h2>
            <div className="space-y-5">
              {benefits.map(b => (
                <div key={b.title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--brand-soft)' }}>
                    <b.icon size={17} style={{ color: 'var(--brand)' }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{b.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="card p-6">
            <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Today's Overview</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Revenue', value: '₹42,800', change: '+12%' },
                { label: 'Appointments',  value: '38',       change: '+5'   },
                { label: 'New Customers', value: '7',        change: '+3'   },
                { label: 'Avg. Ticket',   value: '₹1,126',   change: '+8%'  },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
                    <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>{row.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Revenue This Week</p>
              <div className="flex items-end gap-1 h-16">
                {[55, 70, 45, 85, 60, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: 'var(--brand)', opacity: 0.5 + (i / 14) }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <span key={d} className="text-xs" style={{ color: 'var(--text-muted)' }}>{d}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Loved by <span className="gradient-text">Business Owners</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Simple, <span className="gradient-text">Transparent Pricing</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Start free. Scale as you grow. No hidden fees.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 relative"
                style={plan.highlight
                  ? { background: 'linear-gradient(135deg, var(--brand-light), var(--brand-dark))', border: '1px solid var(--brand)' }
                  : { background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: 'var(--bg)', color: 'var(--brand-light)', border: '1px solid var(--border-brand)' }}>
                    Most Popular
                  </span>
                )}
                <h3 className="font-bold text-xl mb-1" style={{ color: plan.highlight ? '#fff' : 'var(--text-primary)' }}>{plan.name}</h3>
                <p className="text-sm mb-4" style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black" style={{ color: plan.highlight ? '#fff' : 'var(--text-primary)' }}>{plan.price}</span>
                  <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={15} style={{ color: plan.highlight ? '#fff' : 'var(--brand)' }} />
                      <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className="block text-center py-3 rounded-xl font-semibold transition-all"
                  style={plan.highlight
                    ? { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }
                    : { background: 'linear-gradient(135deg, var(--brand-light), var(--brand-dark))', color: '#fff' }}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>FAQ</span>
            <h2 className="text-4xl font-black mt-3 mb-3" style={{ color: 'var(--text-primary)' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>Everything you need to know before getting started.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <motion.div
                  key={faq.q}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card overflow-hidden"
                  style={{ borderColor: isOpen ? 'var(--border-brand)' : 'var(--card-border)' }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <span className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: isOpen ? 'var(--brand-soft)' : 'var(--surface)' }}
                    >
                      <ChevronDown size={15} style={{ color: isOpen ? 'var(--brand)' : 'var(--text-muted)' }} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-6 pb-5 text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Still have questions */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 p-6 rounded-2xl text-center"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--brand-soft)' }}>
              <MessageSquare size={18} style={{ color: 'var(--brand)' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Still have questions?</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Can't find the answer you're looking for? Chat with our friendly team.
            </p>
            <a
              href="mailto:hello@keeng.in"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary text-white"
            >
              Get in touch <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="card rounded-3xl p-12 glow">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join 10,000+ businesses already using Keeng. Start your free 14-day trial today.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg btn-primary text-white">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>No credit card required · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
