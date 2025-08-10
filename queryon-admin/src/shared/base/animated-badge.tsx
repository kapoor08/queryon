import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TranslatableText } from "../elements";

const AnimatedBadge = () => {
  return (
    <div className="relative">
      <Badge className="relative bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
        <Zap className="w-4 h-4 mr-2 animate-pulse" />
        <TranslatableText text="AI-Powered Customer Support" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full animate-pulse" />
      </Badge>
    </div>
  );
};

export default AnimatedBadge;
