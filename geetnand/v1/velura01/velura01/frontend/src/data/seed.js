// Sample platform data for the frontend-only build. Everything here is loaded
// into the platform store once and then edited in place.

export const DEMO_PASSWORD = 'Demo@1234'

export const BIZ_TYPES = ['Salon', 'Spa', 'Beauty Clinic', 'Hair Studio', 'Nail Studio', 'Barbershop', 'Wellness Centre', 'Other']

export const SEED_PLANS = [
  {
    id: 'starter', name: 'Starter', price: 999, maxBranches: 1, maxStaff: 5, smsCredits: 200, active: true,
    description: 'For single-chair studios getting started.',
    features: ['Online booking', 'Billing & GST invoices', 'Customer profiles'],
  },
  {
    id: 'growth', name: 'Growth', price: 2499, maxBranches: 3, maxStaff: 20, smsCredits: 1000, active: true,
    description: 'For growing salons with a few locations.',
    features: ['Everything in Starter', 'Multi-branch dashboard', 'Inventory', 'WhatsApp reminders'],
  },
  {
    id: 'pro', name: 'Pro', price: 4999, maxBranches: 10, maxStaff: 75, smsCredits: 3000, active: true, popular: true,
    description: 'For established brands and franchises.',
    features: ['Everything in Growth', 'Branch-wise reports', 'Memberships & loyalty', 'Marketing campaigns'],
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 14999, maxBranches: 50, maxStaff: 500, smsCredits: 15000, active: true,
    description: 'For chains that need scale and support.',
    features: ['Everything in Pro', 'Dedicated success manager', 'Custom integrations', 'Priority support'],
  },
]

function branch(id, name, city, address, manager, staff, revenueMonth, rating, growth, extra = {}) {
  return {
    id, name, city, address, manager, staff, revenueMonth, rating, growth,
    phone: `98${String(revenueMonth).padStart(8, '0').slice(0, 8)}`,
    appointmentsMonth: Math.round(revenueMonth / 330),
    status: 'active',
    hours: '10:00 AM – 9:00 PM',
    onlineBooking: true,
    ...extra,
  }
}

function business(id, name, type, owner, city, plan, status, createdAt, branches, extra = {}) {
  return {
    id, name, type, owner, city, plan, status, createdAt, branches,
    address: branches[0]?.address || city,
    gstin: '',
    customers: branches.reduce((s, b) => s + Math.round(b.revenueMonth / 260), 0),
    ...extra,
  }
}

export const SEED_BUSINESSES = [
  business('b-glow', 'Glow Salon', 'Salon',
    { name: 'Arjun Kapoor', email: 'owner@glowsalon.in', phone: '9876500000' },
    'Hyderabad', 'pro', 'active', '2025-03-12', [
      branch('glow-hyd', 'Hyderabad', 'Hyderabad', 'Road No. 12, Banjara Hills', { name: 'Priya Sharma', email: 'manager@glowsalon.in' }, 16, 412000, 4.8, 12.4),
      branch('glow-blr', 'Bangalore', 'Bangalore', '100 Feet Road, Indiranagar', { name: 'Kavita Rao', email: 'kavita@glowsalon.in' }, 14, 318000, 4.7, 8.1),
      branch('glow-chn', 'Chennai', 'Chennai', 'Usman Road, T. Nagar', { name: 'Imran Shaikh', email: 'imran@glowsalon.in' }, 12, 236000, 4.5, -3.2),
    ], { gstin: '36AABCG1234K1Z5' }),
  business('b-urban', 'Urban Glam Studio', 'Salon',
    { name: 'Meera Shah', email: 'owner@urbanglam.in', phone: '9822000111' },
    'Mumbai', 'growth', 'active', '2025-06-02', [
      branch('urban-mum', 'Mumbai', 'Mumbai', 'Hill Road, Bandra West', { name: 'Rohan Patil', email: 'manager@urbanglam.in' }, 11, 284000, 4.6, 6.5),
      branch('urban-pun', 'Pune', 'Pune', 'Lane 6, Koregaon Park', { name: 'Sana Kulkarni', email: 'sana@urbanglam.in' }, 8, 171000, 4.7, 14.2),
    ], { gstin: '27AACCU5678M1Z2' }),
  business('b-zen', 'Zen Spa & Wellness', 'Spa',
    { name: 'Rahul Mehta', email: 'rahul@zenspa.in', phone: '9900112233' },
    'Bangalore', 'pro', 'active', '2025-01-20', [
      branch('zen-kor', 'Koramangala', 'Bangalore', '5th Block, Koramangala', { name: 'Divya Menon', email: 'divya@zenspa.in' }, 13, 356000, 4.9, 9.8),
      branch('zen-wht', 'Whitefield', 'Bangalore', 'ITPL Main Road, Whitefield', { name: 'Arvind Nair', email: 'arvind@zenspa.in' }, 10, 241000, 4.6, 4.1),
      branch('zen-mys', 'Mysuru', 'Mysuru', 'Kalidasa Road, VV Mohalla', { name: 'Lakshmi Gowda', email: 'lakshmi@zenspa.in' }, 7, 132000, 4.7, 11.0),
      branch('zen-mng', 'Mangaluru', 'Mangaluru', 'Balmatta Road, Hampankatta', { name: 'Faisal Khan', email: 'faisal@zenspa.in' }, 6, 98000, 4.4, 2.3),
    ]),
  business('b-crown', 'Crown & Comb Barbers', 'Barbershop',
    { name: 'Vikas Sharma', email: 'vikas@crowncomb.in', phone: '9414011223' },
    'Jaipur', 'starter', 'active', '2025-09-14', [
      branch('crown-jpr', 'Jaipur', 'Jaipur', 'MI Road, C-Scheme', { name: 'Vikas Sharma', email: 'vikas@crowncomb.in' }, 5, 96000, 4.8, 18.5),
    ]),
  business('b-lotus', 'Lotus Beauty Clinic', 'Beauty Clinic',
    { name: 'Dr. Nisha Verma', email: 'nisha@lotusclinic.in', phone: '9811223344' },
    'Delhi', 'growth', 'active', '2025-11-03', [
      branch('lotus-gk', 'Greater Kailash', 'Delhi', 'M Block Market, GK-II', { name: 'Ritu Malhotra', email: 'ritu@lotusclinic.in' }, 9, 228000, 4.7, 7.2),
      branch('lotus-ggn', 'Gurugram', 'Gurugram', 'Galleria Market, DLF Phase 4', { name: 'Aman Gill', email: 'aman@lotusclinic.in' }, 7, 164000, 4.5, 5.6),
    ]),
  business('b-velvet', 'Velvet Touch Salon', 'Salon',
    { name: 'Pooja Bansal', email: 'pooja@velvettouch.in', phone: '9811009988' },
    'Delhi', 'starter', 'inactive', '2025-04-28', [
      branch('velvet-ln', 'Lajpat Nagar', 'Delhi', 'Central Market, Lajpat Nagar', { name: 'Pooja Bansal', email: 'pooja@velvettouch.in' }, 4, 0, 4.2, 0, { status: 'inactive' }),
    ], { statusNote: 'Closed by owner for renovation' }),
  business('b-blush', 'Blush Beauty Lounge', 'Salon',
    { name: 'Ananya Ghosh', email: 'ananya@blushlounge.in', phone: '9830044556' },
    'Kolkata', 'growth', 'suspended', '2025-07-19', [
      branch('blush-pk', 'Park Street', 'Kolkata', 'Park Street, Mullick Bazar', { name: 'Ananya Ghosh', email: 'ananya@blushlounge.in' }, 6, 118000, 4.3, -6.4),
      branch('blush-sl', 'Salt Lake', 'Kolkata', 'Sector V, Salt Lake', { name: 'Riya Das', email: 'riya@blushlounge.in' }, 5, 87000, 4.4, -2.1),
    ], { statusNote: 'Subscription payment overdue by 21 days' }),
  business('b-luxe', 'Luxe Nail Studio', 'Nail Studio',
    { name: 'Kritika Joshi', email: 'kritika@luxenails.in', phone: '9925001122' },
    'Ahmedabad', 'starter', 'pending', '2026-11-13', [
      branch('luxe-sg', 'SG Highway', 'Ahmedabad', 'Iscon Cross Road, SG Highway', { name: 'Kritika Joshi', email: 'kritika@luxenails.in' }, 3, 0, 0, 0),
    ], { requestNote: 'Wants to start with one studio and add a second next quarter.' }),
  business('b-aura', 'Aura Hair Studio', 'Hair Studio',
    { name: 'Joseph Mathew', email: 'joseph@aurahair.in', phone: '9847001234' },
    'Kochi', 'growth', 'pending', '2026-11-14', [
      branch('aura-ekm', 'Edappally', 'Kochi', 'NH 66, Edappally', { name: 'Joseph Mathew', email: 'joseph@aurahair.in' }, 6, 0, 0, 0),
      branch('aura-tvm', 'Trivandrum', 'Thiruvananthapuram', 'MG Road, Statue', { name: 'Neethu Varghese', email: 'neethu@aurahair.in' }, 4, 0, 0, 0),
    ], { requestNote: 'Moving from a spreadsheet setup; two existing locations.' }),
]

export const SEED_ACCOUNTS = [
  { email: 'superadmin@keeng.in', name: 'Vikram Rao', role: 'super-admin', title: 'Platform Owner' },
  { email: 'owner@glowsalon.in', name: 'Arjun Kapoor', role: 'owner', title: 'Founder', businessId: 'b-glow' },
  { email: 'manager@glowsalon.in', name: 'Priya Sharma', role: 'manager', title: 'Branch Manager', businessId: 'b-glow', branchIds: ['glow-hyd'] },
  { email: 'kavita@glowsalon.in', name: 'Kavita Rao', role: 'manager', title: 'Branch Manager', businessId: 'b-glow', branchIds: ['glow-blr'] },
  { email: 'imran@glowsalon.in', name: 'Imran Shaikh', role: 'manager', title: 'Branch Manager', businessId: 'b-glow', branchIds: ['glow-chn'] },
  { email: 'employee@glowsalon.in', name: 'Anita Nair', role: 'employee', title: 'Senior Stylist', businessId: 'b-glow', branchIds: ['glow-hyd'] },
  { email: 'owner@urbanglam.in', name: 'Meera Shah', role: 'owner', title: 'Founder', businessId: 'b-urban' },
  { email: 'manager@urbanglam.in', name: 'Rohan Patil', role: 'manager', title: 'Branch Manager', businessId: 'b-urban', branchIds: ['urban-mum'] },
].map(a => ({ ...a, password: DEMO_PASSWORD }))

export const SEED_SETTINGS = {
  platformName: 'Keeng',
  supportEmail: 'support@keeng.in',
  supportPhone: '1800 120 4455',
  allowRegistration: true,
  requireApproval: true,
  trialDays: 14,
  gstRate: 18,
  invoicePrefix: 'KNG',
  maintenanceMode: false,
  maintenanceMessage: 'We are upgrading Keeng. Back shortly!',
}

export const SEED_ACTIVITY = [
  { id: 'a1', type: 'request', text: 'Aura Hair Studio submitted a registration request', at: '2026-11-14T10:42:00+05:30' },
  { id: 'a2', type: 'branch', text: 'Glow Salon opened a new branch in Chennai', at: '2026-11-14T09:15:00+05:30' },
  { id: 'a3', type: 'plan', text: 'Lotus Beauty Clinic upgraded from Starter to Growth', at: '2026-11-13T18:05:00+05:30' },
  { id: 'a4', type: 'request', text: 'Luxe Nail Studio submitted a registration request', at: '2026-11-13T16:30:00+05:30' },
  { id: 'a5', type: 'status', text: 'Blush Beauty Lounge was suspended: payment overdue', at: '2026-11-12T11:20:00+05:30' },
  { id: 'a6', type: 'team', text: 'Zen Spa & Wellness added 3 employees at Mysuru', at: '2026-11-11T14:48:00+05:30' },
]

// Platform totals for the last 12 months; the last point matches the live data.
export const PLATFORM_HISTORY = [
  { month: 'Dec', businesses: 1, branches: 2, subscriptions: 4999, addons: 600 },
  { month: 'Jan', businesses: 2, branches: 5, subscriptions: 9998, addons: 900 },
  { month: 'Feb', businesses: 2, branches: 5, subscriptions: 9998, addons: 1100 },
  { month: 'Mar', businesses: 3, branches: 8, subscriptions: 10997, addons: 1500 },
  { month: 'Apr', businesses: 3, branches: 8, subscriptions: 10997, addons: 1800 },
  { month: 'May', businesses: 4, branches: 9, subscriptions: 13496, addons: 2100 },
  { month: 'Jun', businesses: 4, branches: 10, subscriptions: 13496, addons: 2500 },
  { month: 'Jul', businesses: 5, branches: 12, subscriptions: 13496, addons: 2900 },
  { month: 'Aug', businesses: 5, branches: 12, subscriptions: 13496, addons: 3300 },
  { month: 'Sep', businesses: 6, branches: 13, subscriptions: 15995, addons: 3800 },
  { month: 'Oct', businesses: 6, branches: 13, subscriptions: 15995, addons: 4200 },
  { month: 'Nov', businesses: 7, branches: 15, subscriptions: 15995, addons: 4700 },
]
