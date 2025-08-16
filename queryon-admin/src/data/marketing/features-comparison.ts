export const planFeatures = [
  {
    category: 'Core Features',
    items: [
      {
        name: 'AI-Powered Responses',
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: 'Custom Training',
        starter: 'Basic',
        pro: 'Advanced',
        enterprise: 'Custom Models',
      },
      {
        name: 'Widget Customization',
        starter: 'Standard',
        pro: 'Advanced',
        enterprise: 'White-label',
      },
      {
        name: 'Analytics & Reporting',
        starter: 'Basic',
        pro: 'Advanced',
        enterprise: 'Enterprise',
      },
      { name: 'API Access', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'Support & Training',
    items: [
      { name: 'Email Support', starter: true, pro: true, enterprise: true },
      { name: 'Priority Support', starter: false, pro: true, enterprise: true },
      {
        name: 'Dedicated Manager',
        starter: false,
        pro: false,
        enterprise: true,
      },
      {
        name: 'Training Sessions',
        starter: false,
        pro: '2/month',
        enterprise: 'Unlimited',
      },
      {
        name: 'SLA Guarantee',
        starter: false,
        pro: false,
        enterprise: '99.9%',
      },
    ],
  },
  {
    category: 'Advanced Features',
    items: [
      { name: 'Multi-language', starter: false, pro: true, enterprise: true },
      { name: 'A/B Testing', starter: false, pro: true, enterprise: true },
      {
        name: 'Custom Integrations',
        starter: false,
        pro: 'Limited',
        enterprise: 'Unlimited',
      },
      { name: 'SSO Integration', starter: false, pro: false, enterprise: true },
      {
        name: 'Advanced Security',
        starter: false,
        pro: false,
        enterprise: true,
      },
    ],
  },
];
