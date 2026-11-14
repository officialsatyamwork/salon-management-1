export const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const lakh = n => `₹${(n / 100000).toFixed(n >= 1000000 ? 1 : 2)}L`

export const TONES = {
  violet: '#8b5cf6',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
  rose: '#c4607a',
  cyan: '#0891b2',
  gold: '#c9973a',
  red: '#ef4444',
  gray: '#8b8590',
}

export const AXIS_TICK = { fill: '#9ca3af', fontSize: 11.5 }
