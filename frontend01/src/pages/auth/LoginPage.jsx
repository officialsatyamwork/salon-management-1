import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Star, Mail, Lock } from 'lucide-react'
import logoWhite from '../../assets/logo-whites.png'
import logoBlack from '../../assets/logo-blacks.png'
import { useTheme } from '../../context/ThemeContext'

export default function LoginPage() {
  const { theme } = useTheme()
  const [form, setForm]         = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: 'var(--bg)' }}>

      {/* Background glow */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:'700px', height:'500px', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(196,96,122,0.1) 0%, transparent 70%)', filter:'blur(40px)' }}/>
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(201,151,58,0.07) 0%, transparent 70%)', filter:'blur(40px)' }}/>
      </div>

      <motion.div
        initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img src={theme === 'dark' ? logoWhite : logoBlack} alt="Keeng" className="h-10 w-auto object-contain mx-auto"/>
          </Link>
          <h1 className="text-[2rem] font-black mb-2" style={{ color:'var(--text-primary)', letterSpacing:'-0.025em' }}>
            Welcome back
          </h1>
          <p className="text-[0.9rem]" style={{ color:'var(--text-secondary)' }}>
            Sign in to your Keeng dashboard
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', boxShadow:'0 8px 48px var(--shadow)' }}>
          {/* Top accent */}
          <div style={{ height:'3px', background:'linear-gradient(90deg,var(--brand-dark),var(--brand),var(--gold-light),var(--brand-light))' }}/>

          <div className="p-8 space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold mb-2" style={{ color:'var(--text-primary)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:'var(--text-muted)' }}/>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@business.com" autoComplete="email"
                  className={`input-field pl-11 text-sm ${errors.email ? 'input-error' : ''}`}/>
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                    className="text-[12px] mt-1.5 flex items-center gap-1.5" style={{ color:'#f87171' }}>
                    <span className="w-3.5 h-3.5 rounded-full border border-red-400/60 flex items-center justify-center text-[9px] font-bold flex-shrink-0">!</span>
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold" style={{ color:'var(--text-primary)' }}>Password</label>
                <a href="#" className="text-[12px] font-medium transition-colors" style={{ color:'var(--brand)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--brand)' }}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:'var(--text-muted)' }}/>
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  className={`input-field pl-10 pr-11 text-sm ${errors.password ? 'input-error' : ''}`}/>
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                  style={{ color:'var(--text-muted)', opacity:0.6 }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                    className="text-[12px] mt-1.5 flex items-center gap-1.5" style={{ color:'#f87171' }}>
                    <span className="w-3.5 h-3.5 rounded-full border border-red-400/60 flex items-center justify-center text-[9px] font-bold flex-shrink-0">!</span>
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button type="button" onClick={handleSubmit}
              whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }} disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 btn-primary text-white"
              style={{ opacity: loading ? 0.75 : 1 }}>
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin flex-shrink-0"/>Signing in…</>
                : <>Sign In <ArrowRight size={15}/></>}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background:'var(--border)' }}/>
              <span className="text-[11px]" style={{ color:'var(--text-muted)' }}>or</span>
              <div className="flex-1 h-px" style={{ background:'var(--border)' }}/>
            </div>

            <Link to="/register"
              className="w-full py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 btn-ghost"
              style={{ color:'var(--text-secondary)' }}>
              Create free account <ArrowRight size={14}/>
            </Link>
          </div>
        </div>

        {/* Testimonial */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="mt-5 p-4 rounded-xl flex items-start gap-3"
          style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
            style={{ background:'linear-gradient(135deg,#c4607a,#9a3a54)' }}>PS</div>
          <div>
            <div className="flex gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f59e0b" color="#f59e0b"/>)}
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color:'var(--text-secondary)', fontStyle:'italic' }}>
              "Revenue up 35% in 3 months. Keeng is the best investment I've made."
            </p>
            <p className="text-[11px] mt-1 font-medium" style={{ color:'var(--text-muted)' }}>
              Priya Sharma · Glow Salon, Mumbai
            </p>
          </div>
        </motion.div>

        <p className="text-center text-[11.5px] mt-4" style={{ color:'var(--text-muted)' }}>
          Demo · any email &amp; password (6+ chars)
        </p>
      </motion.div>
    </div>
  )
}
