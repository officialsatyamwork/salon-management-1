import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { post } from '../../lib/api'
import { useAuth } from '../../store/auth'
import AuthShell, { Alert, goldButton, inputClass } from './AuthShell'

// mode="reset": from a forgot-password email. mode="invite": a new team member sets their first password.
export default function SetPasswordPage({ mode }) {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const acceptInvite = useAuth(s => s.acceptInvite)
  const navigate = useNavigate()
  const invite = mode === 'invite'

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setBusy(true); setError('')
    try {
      if (invite) {
        await acceptInvite(token, form.password)
        navigate('/dashboard', { replace: true })
      } else {
        await post('/auth/reset-password', { token, password: form.password }, { auth: false })
        setDone(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!token) {
    return (
      <AuthShell title="Link not valid">
        <Alert>This link is missing its token. Open the link from your email again.</Alert>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={invite ? 'Welcome to Velura' : 'Set a new password'} subtitle={invite ? 'Choose a password to activate your account' : undefined}>
      {done ? (
        <div className="space-y-5">
          <Alert kind="success">Password updated. You can sign in now.</Alert>
          <Link to="/login" className="block w-full py-3 rounded-xl font-semibold text-center" style={goldButton}>Sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && <Alert>{error}</Alert>}
          {[['password', 'New password'], ['confirm', 'Confirm password']].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor={key}>{label}</label>
              <input id={key} type="password" autoComplete="new-password" value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder="Min. 8 characters"
                className={inputClass(false)} style={{ color: '#ede8df' }} />
            </div>
          ))}
          <button type="submit" disabled={busy} className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60" style={goldButton}>
            {busy && <Loader2 size={18} className="animate-spin" />} {invite ? 'Activate account' : 'Update password'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}
