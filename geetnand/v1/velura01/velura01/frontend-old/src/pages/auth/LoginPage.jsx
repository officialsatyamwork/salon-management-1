import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../../store/auth'
import RoleWorkspaces from '../../components/auth/RoleWorkspaces'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuth(s => s.login)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
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
      await login(form.email.trim(), form.password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setFormError(err.message)
      setErrors(err.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0b0e18' }}>
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
        className="relative w-full max-w-5xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#c9973a,#a87828)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Velura</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Staff, manager, admin, and super admin sign in here</p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] gap-6 items-start">
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {formError && (
              <div role="alert" className="text-sm rounded-xl px-4 py-3" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                {formError}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@business.com"
                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 placeholder-gray-600 focus:outline-none transition-colors`}
                style={{ color: '#ede8df' }}
                onFocus={e => { if (!errors.email) e.target.style.borderColor = 'rgba(201,151,58,0.6)' }}
                onBlur={e => { e.target.style.borderColor = errors.email ? '' : 'rgba(255,255,255,0.1)' }}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
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

            <div className="flex justify-end">
              <Link to="/forgot-password" style={{ color: '#c9973a' }} className="text-sm hover:opacity-80">Forgot password?</Link>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#c9973a,#a87828)', color: '#0b0e18' }}>
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#c9973a' }} className="font-medium hover:opacity-80">Create one free</Link>
            </p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 lg:sticky lg:top-8">
          <RoleWorkspaces />
        </div>
        </div>
      </motion.div>
    </div>
  )
}
