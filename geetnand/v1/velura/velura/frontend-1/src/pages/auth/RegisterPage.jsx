import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../../store/auth'

const businessTypes = ['Salon', 'Spa', 'Beauty Clinic', 'Hair Studio', 'Wellness Centre', 'Tattoo Studio', 'Other']

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', businessName: '', businessType: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const register = useAuth(s => s.register)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone) e.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number'
    if (!form.businessName.trim()) e.businessName = 'Business name is required'
    if (!form.businessType) e.businessType = 'Select business type'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    setFormError('')
    if (Object.keys(errs).length) return
    setSubmitting(true)
    try {
      const { confirm: _confirm, ...body } = form
      await register({ ...body, email: body.email.trim() })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message)
      setErrors(err.code === 'email_taken' ? { email: err.message } : err.fields)
    } finally {
      setSubmitting(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-white/5 border ${errors[key] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none transition-colors`}
        style={{ color: '#ede8df' }}
        onFocus={e => { if (!errors[key]) e.target.style.borderColor = 'rgba(201,151,58,0.6)' }}
        onBlur={e => { e.target.style.borderColor = errors[key] ? '' : 'rgba(255,255,255,0.1)' }}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#0b0e18' }}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,14,24,0.95) 0%, rgba(11,14,24,0.85) 100%)' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'rgba(201,151,58,0.06)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c9973a,#a87828)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Velura</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Start your free trial</h1>
          <p className="text-gray-400">14 days free · No credit card required</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {formError && (
              <div role="alert" className="text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                {formError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {field('name', 'Full Name', 'text', 'Your name')}
              {field('phone', 'Phone Number', 'tel', '10-digit number')}
            </div>
            {field('email', 'Email Address', 'email', 'you@business.com')}
            {field('businessName', 'Business Name', 'text', 'Your salon / spa name')}

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Business Type</label>
              <select
                value={form.businessType}
                onChange={e => setForm({ ...form, businessType: e.target.value })}
                className={`w-full bg-white/5 border ${errors.businessType ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none transition-colors`}
                style={{ color: '#ede8df' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,151,58,0.6)' }}
                onBlur={e => { e.target.style.borderColor = errors.businessType ? '' : 'rgba(255,255,255,0.1)' }}
              >
                <option value="" className="bg-[#13131a]">Select type</option>
                {businessTypes.map(t => <option key={t} value={t} className="bg-[#13131a]">{t}</option>)}
              </select>
              {errors.businessType && <p className="text-red-400 text-xs mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none transition-colors pr-12`}
                  style={{ color: '#ede8df' }}
                  onFocus={e => { if (!errors.password) e.target.style.borderColor = 'rgba(201,151,58,0.6)' }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? '' : 'rgba(255,255,255,0.1)' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Re-enter password"
                className={`w-full bg-white/5 border ${errors.confirm ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none transition-colors`}
                style={{ color: '#ede8df' }}
                onFocus={e => { if (!errors.confirm) e.target.style.borderColor = 'rgba(201,151,58,0.6)' }}
                onBlur={e => { e.target.style.borderColor = errors.confirm ? '' : 'rgba(255,255,255,0.1)' }}
              />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#c9973a,#a87828)', color: '#0b0e18' }}>
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Creating account…</> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c9973a' }} className="font-medium hover:opacity-80">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
