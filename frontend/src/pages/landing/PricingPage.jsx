import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Check, X, ArrowRight, Zap, Shield, Clock,
  ChevronDown, Star, MessageSquare, Phone, Mail, Sparkles
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 999,
    yearlyPrice: 799,
    period: '/month',
    desc: 'Perfect for single-location solo stylists or small salons just getting started.',
    color: '#6b7280',
    highlight: false,
    badge: null,
    features: {
      'Branches': '1',
      'Staff Accounts': 'Up to 3',
      'Appointments': 'Unlimited',
      'Billing & POS': true,
      'Customer CRM': 'Basic',
      'Inventory': false,
      'WhatsApp Reminders': '100/month',
      'Email Campaigns': false,
      'Loyalty & Membership': false,
      'Analytics & Reports': 'Basic',
      'Multi-Branch': false,
      'API Access': false,
      'White Label': false,
      'Support': 'Email (48h)',
      'Onboarding': 'Self-serve',
    },
    cta: 'Start Free Trial',
    ctaLink: '/register',
  },
  {
    name: 'Growth',
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    period: '/month',
    desc: 'For growing salons and spas that need the full suite — CRM, marketing, and analytics.',
    color: '#c4607a',
    highlight: true,
    badge: 'Most Popular',
    features: {
      'Branches': 'Up to 3',
      'Staff Accounts': 'Up to 15',
      'Appointments': 'Unlimited',
      'Billing & POS': true,
      'Customer CRM': 'Advanced',
      'Inventory': true,
      'WhatsApp Reminders': '1,000/month',
      'Email Campaigns': true,
      'Loyalty & Membership': true,
      'Analytics & Reports': 'Advanced',
      'Multi-Branch': true,
      'API Access': false,
      'White Label': false,
      'Support': 'Priority (4h)',
      'Onboarding': 'Guided setup call',
    },
    cta: 'Start Free Trial',
    ctaLink: '/register',
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    period: '',
    desc: 'For large chains, franchises, and businesses with custom requirements.',
    color: '#c9973a',
    highlight: false,
    badge: 'Custom',
    features: {
      'Branches': 'Unlimited',
      'Staff Accounts': 'Unlimited',
      'Appointments': 'Unlimited',
      'Billing & POS': true,
      'Customer CRM': 'Enterprise',
      'Inventory': true,
      'WhatsApp Reminders': 'Unlimited',
      'Email Campaigns': true,
      'Loyalty & Membership': true,
      'Analytics & Reports': 'Enterprise + Custom',
      'Multi-Branch': true,
      'API Access': true,
      'White Label': true,
      'Support': 'Dedicated Manager',
      'Onboarding': 'Full onboarding team',
    },
    cta: 'Contact Sales',
    ctaLink: '/register',
  },
]

const featureRows = [
  'Branches', 'Staff Accounts', 'Appointments', 'Billing & POS',
  'Customer CRM', 'Inventory', 'WhatsApp Reminders', 'Email Campaigns',
  'Loyalty & Membership', 'Analytics & Reports', 'Multi-Branch',
  'API Access', 'White Label', 'Support', 'Onboarding',
]

const faqs = [
  {
    q: 'Is there really no credit card required for the trial?',
    a: 'Correct — start your 14-day trial with just an email address. We\'ll only ask for payment details when you decide to continue.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or downgrade at any time. When you upgrade, the change is instant. When you downgrade, the change takes effect at the next billing cycle.',
  },
  {
    q: 'What does "yearly billing" mean for pricing?',
    a: 'When you choose the yearly plan, you pay for 12 months upfront at the discounted per-month rate. This saves you around 20% compared to monthly billing.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'You can export all your data — customers, appointments, invoices — before your subscription ends. After 30 days post-cancellation, data is permanently deleted.',
  },
  {
    q: 'Do you support GST billing in India?',
    a: 'Yes, Keeng is fully GST-compliant. All invoices include GSTIN, HSN/SAC codes, and are formatted per Indian tax requirements.',
  },
  {
    q: 'Can I manage multiple branches on one account?',
    a: 'Yes — the Growth plan supports up to 3 branches and Enterprise supports unlimited. All branches share the same customer database and you get consolidated reports.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'None. Starter and Growth have zero setup fees. Enterprise may include an optional paid implementation package for large-scale deployments.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, all major credit/debit cards, and net banking. For Enterprise, we also support bank transfer and purchase orders.',
  },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Glow Salon, Mumbai', text: 'Growth plan. 3 branches. Revenue up 35% in 3 months. The ROI was clear from week one.', rating: 5 },
  { name: 'Rahul Mehta', role: 'Zen Spa, Bangalore', text: 'Started on Starter, upgraded to Growth in month 2. Best ₹2,499 I spend every month.', rating: 5 },
  { name: 'Suresh Nambiar', role: 'Flair Salons (8 branches), Kerala', text: 'Enterprise was the only choice for us. The dedicated manager and custom reports made the transition seamless.', rating: 5 },
]

function FeatureValue({ value }) {
  if (value === true) return <Check size={18} style={{ color: '#22c55e' }} className="mx-auto" />
  if (value === false) return <X size={16} style={{ color: 'var(--text-muted)' }} className="mx-auto" />
  return <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value}</span>
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s, color 0.3s' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--brand)' }}>
            Pricing
          </span>
          <h1 className="text-5xl md:text-6xl font-black mt-4 mb-5 leading-tight">
            Simple, honest <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: 'var(--text-secondary)' }}>
            Start free. Scale as you grow. No hidden fees, no surprise invoices.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setYearly(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: !yearly ? 'var(--card-bg)' : 'transparent',
                color: !yearly ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: !yearly ? '1px solid var(--border-brand)' : '1px solid transparent',
                boxShadow: !yearly ? '0 2px 8px var(--shadow)' : 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              style={{
                background: yearly ? 'var(--card-bg)' : 'transparent',
                color: yearly ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: yearly ? '1px solid var(--border-brand)' : '1px solid transparent',
                boxShadow: yearly ? '0 2px 8px var(--shadow)' : 'none',
              }}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plan cards */}
      <section className="px-6 pb-20">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className="rounded-2xl p-7 relative flex flex-col"
              style={plan.highlight
                ? {
                    background: 'linear-gradient(145deg, var(--brand-dark) 0%, var(--brand) 60%, var(--brand-light) 100%)',
                    border: '1px solid var(--brand-light)',
                    boxShadow: '0 20px 60px var(--brand-glow)',
                  }
                : {
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                  }
              }
            >
              {plan.badge && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs px-4 py-1.5 rounded-full font-bold flex items-center gap-1"
                  style={plan.highlight
                    ? { background: 'var(--bg)', color: 'var(--brand)', border: '1px solid var(--border-brand)' }
                    : { background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}40` }
                  }
                >
                  {plan.highlight && <Sparkles size={11} />}
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-black mb-1" style={{ color: plan.highlight ? '#fff' : 'var(--text-primary)' }}>
                  {plan.name}
                </h2>
                <p className="text-sm mb-5" style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>
                  {plan.desc}
                </p>

                <div className="flex items-baseline gap-1">
                  {plan.monthlyPrice ? (
                    <>
                      <span className="text-5xl font-black" style={{ color: plan.highlight ? '#fff' : 'var(--text-primary)' }}>
                        ₹{yearly ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                      </span>
                      <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>/mo</span>
                      {yearly && (
                        <span className="text-xs line-through ml-2" style={{ color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)' }}>
                          ₹{plan.monthlyPrice.toLocaleString()}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-black" style={{ color: plan.highlight ? '#fff' : 'var(--text-primary)' }}>
                      Custom
                    </span>
                  )}
                </div>
                {yearly && plan.monthlyPrice && (
                  <p className="text-xs mt-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
                    Billed ₹{(plan.yearlyPrice * 12).toLocaleString()}/year
                  </p>
                )}
              </div>

              {/* Top features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {Object.entries(plan.features).slice(0, 8).map(([key, val]) => val !== false && (
                  <li key={key} className="flex items-center gap-2.5 text-sm">
                    <Check size={14} style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'var(--brand)', flexShrink: 0 }} />
                    <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}>
                      {typeof val === 'string' ? `${key}: ${val}` : key}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={plan.highlight
                  ? { background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }
                  : { background: 'linear-gradient(135deg, var(--brand-light), var(--brand-dark))', color: '#fff' }
                }
              >
                {plan.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          All plans include a 14-day free trial · No credit card required
        </p>
      </section>

      {/* Feature comparison table */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              Full <span className="gradient-text">Feature Comparison</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-3)' }}>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: 'var(--text-muted)', width: '36%' }}>Feature</th>
                  {plans.map(p => (
                    <th key={p.name} className="text-center p-4 text-sm font-bold" style={{ color: p.highlight ? 'var(--brand-light)' : 'var(--text-primary)' }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr
                    key={row}
                    style={{
                      background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{row}</td>
                    {plans.map(p => (
                      <td key={p.name} className="p-4 text-center">
                        <FeatureValue value={p.features[row]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              What our customers <span className="gradient-text">actually say</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
              Pricing <span className="gradient-text">FAQs</span>
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Enterprise */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6">
            {/* Enterprise card */}
            <div className="card p-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--brand-soft)' }}>
                <Zap size={20} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Need a custom plan?</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Running a large chain or franchise? We'll build a plan around your exact requirements — volume pricing, custom integrations, white labeling, and a dedicated account team.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-semibold text-sm text-white">
                Contact Sales <ArrowRight size={15} />
              </Link>
            </div>

            {/* Support card */}
            <div className="card p-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--brand-soft)' }}>
                <Shield size={20} style={{ color: 'var(--brand)' }} />
              </div>
              <h3 className="text-xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>We're here to help</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Questions before you sign up? Our team is available to answer anything — no sales pressure, just honest answers.
              </p>
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, label: 'WhatsApp', value: '+91 98765 43210' },
                  { icon: Mail,          label: 'Email',    value: 'hello@keeng.in' },
                  { icon: Phone,         label: 'Call',     value: '+91 80 4567 8900' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface)' }}>
                      <c.icon size={14} style={{ color: 'var(--brand)' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.label}:</span> {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="card rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Start free today. <span className="gradient-text">Pay only when you're ready.</span>
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every plan starts with a full-featured 14-day free trial. No credit card, no catch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg btn-primary text-white">
                Start Free Trial <ArrowRight size={20} />
              </Link>
              <Link to="/features" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-lg btn-ghost" style={{ color: 'var(--text-secondary)' }}>
                See All Features
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              {['14-day free trial', 'No credit card', 'Cancel anytime', '5-min setup'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Check size={13} style={{ color: 'var(--brand)' }} /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
