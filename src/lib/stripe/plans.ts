export const PLANS = {
  individual: {
    name: 'Individual',
    description: 'For one person who wants the spam calls to stop.',
    price_monthly: 9,
    price_annual: 79,
    features: [
      '1 person monitored',
      '200+ data broker scan',
      'Monthly automatic re-scan',
      'Automated opt-out submissions',
      'Removal verification tracking',
      'Email alerts on re-listings',
    ],
    max_persons: 1,
    highlight: false,
  },
  family: {
    name: 'Family',
    description: 'Protect everyone under your roof.',
    price_monthly: 19,
    price_annual: 149,
    features: [
      'Up to 4 people monitored',
      '200+ broker scan per person',
      'Monthly automatic re-scans',
      'Automated opt-out submissions',
      'Family dashboard view',
      'Priority email support',
    ],
    max_persons: 4,
    highlight: true,
  },
  small_biz: {
    name: 'Small Business',
    description: 'For founders and small teams who want their information off the internet.',
    price_monthly: 49,
    price_annual: 399,
    features: [
      'Up to 10 employees monitored',
      'Quarterly compliance reports',
      'Slack alert integration',
      'Priority support',
      'Bulk CSV employee import',
    ],
    max_persons: 10,
    highlight: false,
  },
} as const

export type PlanKey = keyof typeof PLANS