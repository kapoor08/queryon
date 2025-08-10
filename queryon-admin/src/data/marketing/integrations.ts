import { Globe, Zap } from "lucide-react";

export const integrationMethods = [
  {
    title: "Vercel Hosted",
    description:
      "Deploy directly from our Vercel hosting with automatic updates",
    code: '<script src="https://your-chat-widget.vercel.app/chat-widget.js"></script>',
    badge: "Recommended",
    badgeColor: "bg-emerald-500",
    icon: Zap,
  },
  {
    title: "jsDelivr CDN",
    description: "Use our global CDN for lightning-fast loading worldwide",
    code: '<script src="https://cdn.jsdelivr.net/gh/johndoe/chat-widget/dist/chat-widget.js"></script>',
    badge: "Fast",
    badgeColor: "bg-blue-500",
    icon: Globe,
  },
];
