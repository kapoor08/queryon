import {
  LayoutDashboard,
  MessageSquare,
  Palette,
  Users,
  CreditCard,
  Bell,
  HelpCircle,
  UserPlus,
  Zap,
  BookOpen,
  Plug,
  Activity,
  Layers,
  Smartphone,
  Shield,
  Paintbrush,
  TestTube,
  Video,
} from 'lucide-react';

export const navigation = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Conversations',
        href: '/user/conversations',
        icon: MessageSquare,
        badge: '23',
      },
      {
        title: 'Leads',
        href: '/user/leads',
        icon: UserPlus,
        badge: '12',
      },
    ],
  },
  {
    title: 'Widget Management',
    items: [
      {
        title: 'Widgets',
        href: '/user/widgets',
        icon: MessageSquare,
      },
      {
        title: 'Customization',
        href: '/user/customizations',
        icon: Palette,
      },
      {
        title: 'Templates',
        href: '/user/templates',
        icon: Layers,
      },
      {
        title: 'A/B Testing',
        href: '/user/ab-testing',
        icon: TestTube,
      },
    ],
  },
  {
    title: 'Automation',
    items: [
      {
        title: 'Workflows',
        href: '/user/workflows',
        icon: Zap,
      },
      {
        title: 'Knowledge Base',
        href: '/user/knowledge',
        icon: BookOpen,
      },
    ],
  },
  {
    title: 'Integrations',
    items: [
      {
        title: 'Integrations',
        href: '/user/integrations',
        icon: Plug,
      },
      {
        title: 'Mobile SDK',
        href: '/user/mobile',
        icon: Smartphone,
      },
      {
        title: 'Voice & Video',
        href: '/user/voice-video',
        icon: Video,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Team',
        href: '/user/team',
        icon: Users,
      },
      {
        title: 'Performance',
        href: '/user/performance',
        icon: Activity,
      },
      {
        title: 'Compliance',
        href: '/user/compliance',
        icon: Shield,
      },
      {
        title: 'White Label',
        href: '/user/white-label',
        icon: Paintbrush,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Billing',
        href: '/user/billing',
        icon: CreditCard,
      },
      {
        title: 'Notifications',
        href: '/user/notifications',
        icon: Bell,
      },
      {
        title: 'Help Center',
        href: '/user/help',
        icon: HelpCircle,
      },
    ],
  },
];
