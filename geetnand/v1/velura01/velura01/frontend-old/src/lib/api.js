// Small fetch wrapper for the Velura API.
// - Access token lives in memory only (never localStorage).
// - Refresh token is an httpOnly cookie the browser sends to /auth/* automatically.
// - On an expired access token, refreshes once and retries the request.

const BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

let accessToken = null
let refreshing = null
let onSessionChange = () => {}

export function setAccessToken(token) { accessToken = token }
export function onSession(fn) { onSessionChange = fn }

export class ApiError extends Error {
  constructor(status, body) {
    const err = body?.error || {}
    super(err.message || `Request failed (${status})`)
    this.status = status
    this.code = err.code || 'http_error'
    this.details = err.details
  }

  // Validation errors as { fieldName: message } for forms.
  get fields() {
    if (!Array.isArray(this.details)) return {}
    return Object.fromEntries(this.details.map(d => [d.field, d.message.replace(/^Value error, /, '')]))
  }
}

async function raw(path, { method = 'GET', body, headers = {}, auth = true, signal } = {}) {
  const h = { Accept: 'application/json', ...headers }
  if (body !== undefined) h['Content-Type'] = 'application/json'
  if (auth && accessToken) h.Authorization = `Bearer ${accessToken}`
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method, headers: h, credentials: 'include', signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ApiError(0, { error: { code: 'network_error', message: 'Cannot reach the server. Check your connection.' } })
  }
  if (res.status === 204) return { res, data: null }
  const data = await res.json().catch(() => null)
  return { res, data }
}

// One refresh at a time, shared by every request that needs it.
export function refreshSession() {
  if (!refreshing) {
    refreshing = raw('/auth/refresh', { method: 'POST', auth: false })
      .then(({ res, data }) => {
        if (!res.ok) throw new ApiError(res.status, data)
        accessToken = data.accessToken
        onSessionChange(data)
        return data
      })
      .catch(e => { accessToken = null; onSessionChange(null); throw e })
      .finally(() => { refreshing = null })
  }
  return refreshing
}

export async function api(path, opts = {}) {
  let { res, data } = await raw(path, opts)
  if (res.status === 401 && opts.auth !== false && accessToken && ['token_expired', 'invalid_token'].includes(data?.error?.code)) {
    await refreshSession()
    ;({ res, data } = await raw(path, opts))
  }
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

export const get = (p, opts) => api(p, opts)
export const post = (p, body, opts) => api(p, { ...opts, method: 'POST', body })
export const put = (p, body, opts) => api(p, { ...opts, method: 'PUT', body })
export const patch = (p, body, opts) => api(p, { ...opts, method: 'PATCH', body })
export const del = (p, opts) => api(p, { ...opts, method: 'DELETE' })
