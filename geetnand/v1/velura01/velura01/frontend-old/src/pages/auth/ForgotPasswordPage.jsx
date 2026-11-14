import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { post } from '../../lib/api'
import AuthShell, { Alert, goldButton, inputClass } from './AuthShell'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    setBusy(true); setError('')
    try {
      await post('/auth/forgot-password', { email: email.trim() }, { auth: false })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Forgot password?" subtitle="We'll email you a link to set a new one">
      {sent ? (
        <div className="space-y-5">
          <Alert kind="success">If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.</Alert>
          <Link to="/login" className="block text-center text-sm" style={{ color: '#c9973a' }}>Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && <Alert>{error}</Alert>}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="email">Email Address</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@business.com" className={inputClass(!!error)} style={{ color: '#ede8df' }} />
          </div>
          <button type="submit" disabled={busy} className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60" style={goldButton}>
            {busy && <Loader2 size={18} className="animate-spin" />} Send reset link
          </button>
          <Link to="/login" className="block text-center text-sm text-gray-400 hover:text-white">Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  )
}
