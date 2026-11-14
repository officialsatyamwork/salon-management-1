import { create } from 'zustand'
import { onSession, post, refreshSession, setAccessToken } from '../lib/api'

export const ROLE_LABELS = {
  master_admin: 'Master Admin',
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
  staff: 'Staff',
  customer: 'Customer',
}

// Mirrors the backend's release plan; modules not listed here show sample data.
export const LIVE_MODULES = new Set(['dashboard', 'branches', 'settings'])
export const MODULE_RELEASE = {
  appointments: 'V2', customers: 'V2', staff: 'V2', services: 'V2', membership: 'V2',
  billing: 'V3', inventory: 'V3', marketing: 'V3', reports: 'V3',
}

export const useAuth = create((set, get) => ({
  status: 'loading', // loading | authed | guest
  user: null,
  salonId: null, // null = "All my salons"

  setSession(data) {
    if (data) {
      setAccessToken(data.accessToken)
      const keep = get().salonId
      const stillAllowed = keep && data.user.salons.some(s => s.id === keep)
      set({ status: 'authed', user: data.user, salonId: stillAllowed ? keep : null })
    } else {
      setAccessToken(null)
      set({ status: 'guest', user: null, salonId: null })
    }
  },

  // On page load, the httpOnly cookie may still hold a valid session.
  async bootstrap() {
    try { await refreshSession() } catch { get().setSession(null) }
  },

  async login(email, password) {
    get().setSession(await post('/auth/login', { email, password }, { auth: false }))
  },

  async register(form) {
    get().setSession(await post('/auth/register', form, { auth: false }))
  },

  async acceptInvite(token, password) {
    get().setSession(await post('/auth/accept-invite', { token, password }, { auth: false }))
  },

  async logout() {
    try { await post('/auth/logout', undefined, { auth: false }) } catch { /* still sign out locally */ }
    get().setSession(null)
  },

  setSalon(salonId) { set({ salonId }) },

  can(module) { return get().user?.modules?.includes(module) ?? false },
}))

onSession(data => useAuth.getState().setSession(data))
