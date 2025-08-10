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
} from "lucide-react";

export const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Conversations",
        href: "/dashboard/conversations",
        icon: MessageSquare,
        badge: "23",
      },
      {
        title: "Leads",
        href: "/dashboard/leads",
        icon: UserPlus,
        badge: "12",
      },
    ],
  },
  {
    title: "Widget Management",
    items: [
      {
        title: "Widgets",
        href: "/dashboard/widgets",
        icon: MessageSquare,
      },
      {
        title: "Customization",
        href: "/dashboard/customization",
        icon: Palette,
      },
      {
        title: "Templates",
        href: "/dashboard/templates",
        icon: Layers,
      },
      {
        title: "A/B Testing",
        href: "/dashboard/ab-testing",
        icon: TestTube,
      },
    ],
  },
  {
    title: "Automation",
    items: [
      {
        title: "Workflows",
        href: "/dashboard/workflows",
        icon: Zap,
      },
      {
        title: "Knowledge Base",
        href: "/dashboard/knowledge",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: Plug,
      },
      {
        title: "Mobile SDK",
        href: "/dashboard/mobile",
        icon: Smartphone,
      },
      {
        title: "Voice & Video",
        href: "/dashboard/voice-video",
        icon: Video,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Team",
        href: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Performance",
        href: "/dashboard/performance",
        icon: Activity,
      },
      {
        title: "Compliance",
        href: "/dashboard/compliance",
        icon: Shield,
      },
      {
        title: "White Label",
        href: "/dashboard/white-label",
        icon: Paintbrush,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Help Center",
        href: "/dashboard/help",
        icon: HelpCircle,
      },
    ],
  },
];
