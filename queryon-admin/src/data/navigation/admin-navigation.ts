import {
  LayoutDashboard,
  Users,
  Bot,
  CreditCard,
  Settings,
  FileText,
  BarChart3,
  Key,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Model Training",
    href: "/admin/training",
    icon: Bot,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "API Keys",
    href: "/admin/api-keys",
    icon: Key,
  },
  {
    title: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
