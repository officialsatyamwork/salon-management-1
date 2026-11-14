import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart, Target, Users, Zap, Shield, Globe,
  TrendingUp, ArrowRight, Star, Award, Lightbulb, Handshake
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const team = [
  {
    name: 'Arjun Kapoor',
    role: 'CEO & Co-Founder',
    desc: 'Former GM at a leading salon chain in India. 12+ years in beauty & wellness. Built Keeng after experiencing the pain of managing 8 branches with spreadsheets.',
    initials: 'AK',
    color: '#c4607a',
  },
  {
    name: 'Sneha Iyer',
    role: 'CTO & Co-Founder',
    desc: 'Ex-engineering lead at a fintech startup. Passionate about building software that just works. Believes great design and reliability go hand in hand.',
    initials: 'SI',
    color: '#7c3aed',
  },
  {
    name: 'Ravi Desai',
    role: 'Head of Product',
    desc: 'Product nerd with a background in UX and customer research. Has personally interviewed 500+ salon owners to shape every feature in Keeng.',
    initials: 'RD',
    color: '#c9973a',
  },
  {
    name: 'Meera Pillai',
    role: 'Head of Customer Success',
    desc: 'Formerly a spa owner herself. Leads onboarding and support with the goal that every Keeng customer feels genuinely taken care of.',
    initials: 'MP',
    color: '#059669',
  },
]

const values = [
  {
    icon: Heart,
    title: 'Built with Empathy',
    desc: 'Every feature is designed by listening to real salon owners — not just engineers. We understand the chaos of a busy Saturday and build accordingly.',
  },
  {
    icon: Target,
    title: 'Obsessed with Simplicity',
    desc: 'Powerful doesn\'t have to mean complicated. We strip away complexity so you can focus on clients, not software.',
  },
  {
    icon: Shield,
    title: 'Reliability First',
    desc: 'Your business can\'t afford downtime. We maintain 99.9% uptime and take data security as seriously as a bank.',
  },
  {
    icon: Handshake,
    title: 'Genuine Partnership',
    desc: 'We grow when you grow. Our pricing and support model is built to be a true long-term partner, not just a vendor.',
  },
  {
    icon: Lightbulb,
    title: 'Always Innovating',
    desc: 'The beauty industry evolves fast. We release meaningful updates every month, driven directly by customer feedback.',
  },
  {
    icon: Globe,
    title: 'India-First Design',
    desc: 'GST billing, WhatsApp integration, INR — built for how Indian businesses actually operate, not retrofitted from a Western product.',
  },
]

const milestones = [
  { year: '2020', title: 'The Problem', desc: 'Arjun and Sneha meet at a startup event. Arjun is frustrated managing his 3 salons on WhatsApp and Excel. Sneha sees a product waiting to be built.' },
  { year: '2021', title: 'First Version', desc: 'After 6 months of customer interviews and development, Keeng v1 launches with 12 pilot salons in Mumbai and Pune.' },
  { year: '2022', title: 'Product-Market Fit', desc: 'Word of mouth takes over. 500 businesses onboard within the first year. The team grows to 15 and raises a seed round.' },
  { year: '2023', title: 'Scaling Up', desc: 'Multi-branch support, marketing automation, and the loyalty module launch. Keeng crosses 5,000 active businesses.' },
  { year: '2024', title: 'Today', desc: '10,000+ businesses across India trust Keeng. 2.5 million appointments booked. Expanding to Southeast Asia.' },
]

const stats = [
  { value: '10,000+', label: 'Businesses', icon: Users },
  { value: '2.5M+', label: 'Appointments', icon: TrendingUp },
  { value: '98%', label: 'Satisfaction', icon: Star },
  { value: '4', label: 'Years Building', icon: Award },
]

export default function AboutPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s, color 0.3s' }}
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">
              We built the tool{' '}
              <span className="gradient-text">we wished existed</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Keeng was born from frustration — the kind that comes from managing a growing salon
              business with spreadsheets, sticky notes, and endless WhatsApp threads. We knew there
              had to be a better way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section
        className="py-16 px-6"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--brand-soft)' }}
              >
                <s.icon size={18} style={{ color: 'var(--brand)' }} />
              </div>
              <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              Our Mission
            </span>
            <h2 className="text-4xl font-black mt-3 mb-6" style={{ color: 'var(--text-primary)' }}>
              Empowering every beauty business to{' '}
              <span className="gradient-text">thrive, not just survive</span>
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              The beauty and wellness industry in India employs millions and serves hundreds of millions —
              yet most businesses still run on manual processes, paper registers, and disconnected apps.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Our mission is to give every salon, spa, and wellness centre — from a single-chair studio
              to a multi-city chain — the tools that were previously only available to large enterprise
              businesses. Affordable, easy to use, and designed specifically for how Indian beauty
              businesses operate.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="card p-8"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--brand-soft)' }}
            >
              <Target size={24} style={{ color: 'var(--brand)' }} />
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              The Vision
            </h3>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              A world where every beauty professional can focus entirely on their craft — not on
              administrative chaos. Where scheduling, billing, marketing, and analytics run themselves
              in the background.
            </p>
            <div className="space-y-3">
              {[
                'Make salon management effortless',
                'Help businesses grow their revenue',
                'Give customers a seamless experience',
                'Bring enterprise tools to every business size',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--brand-soft)' }}
                  >
                    <Zap size={10} style={{ color: 'var(--brand)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              What We Stand For
            </span>
            <h2 className="text-4xl font-black mt-3" style={{ color: 'var(--text-primary)' }}>
              Our <span className="gradient-text">Core Values</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map(v => (
              <motion.div key={v.title} variants={fadeUp} className="card p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--brand-soft)' }}
                >
                  <v.icon size={20} style={{ color: 'var(--brand)' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              The Journey
            </span>
            <h2 className="text-4xl font-black mt-3" style={{ color: 'var(--text-primary)' }}>
              How We Got <span className="gradient-text">Here</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[88px] top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'var(--border)' }}
            />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 items-start"
                >
                  {/* Year badge */}
                  <div className="flex-shrink-0 text-right w-16 hidden md:block">
                    <span
                      className="text-sm font-black"
                      style={{ color: 'var(--brand)' }}
                    >
                      {m.year}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="relative hidden md:flex items-center justify-center flex-shrink-0">
                    <div
                      className="w-4 h-4 rounded-full border-2 z-10"
                      style={{ background: 'var(--bg)', borderColor: 'var(--brand)' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="card p-5 flex-1">
                    <span
                      className="text-xs font-bold uppercase tracking-wider md:hidden"
                      style={{ color: 'var(--brand)' }}
                    >
                      {m.year} ·{' '}
                    </span>
                    <h3 className="font-bold mb-2 inline md:block" style={{ color: 'var(--text-primary)' }}>
                      {m.title}
                    </h3>
                    <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--brand)' }}
            >
              The People
            </span>
            <h2 className="text-4xl font-black mt-3" style={{ color: 'var(--text-primary)' }}>
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A small team with deep experience in the beauty industry and software. We use Keeng
              ourselves every day, which keeps us honest.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map(member => (
              <motion.div key={member.name} variants={fadeUp} className="card p-6 text-center">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-xl"
                  style={{ background: `linear-gradient(135deg, ${member.color}cc, ${member.color})` }}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--brand)' }}
                >
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="card rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to be part of{' '}
              <span className="gradient-text">the story?</span>
            </h2>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join 10,000+ businesses that have made Keeng the backbone of their daily operations.
              Start your free 14-day trial — no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base btn-primary text-white"
              >
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base btn-ghost"
                style={{ color: 'var(--text-secondary)' }}
              >
                See All Features
              </Link>
            </div>
            <p className="text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
              No credit card required · Cancel anytime · Setup in 5 minutes
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
