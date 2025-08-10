import { Shield, Star, Zap } from "lucide-react";

export const STATS = [
  { value: "99.9%", label: "Uptime", icon: Shield, color: "text-green-400" },
  {
    value: "<200ms",
    label: "Response Time",
    icon: Zap,
    color: "text-yellow-400",
  },
  { value: "50+", label: "Languages", icon: Star, color: "text-blue-400" },
];
