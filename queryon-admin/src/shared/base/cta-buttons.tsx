import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TranslatableText } from '../elements/client';

const CTAButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <Button
        size="lg"
        className="group relative bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 will-change-transform"
      >
        <span className="relative z-10 flex items-center">
          <TranslatableText text="Get Started Free" />
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="group relative border-slate-600 text-slate-300 hover:bg-white/5 hover:border-white/30 px-8 py-4 text-lg bg-transparent backdrop-blur-sm transition-all duration-300 hover:scale-105 will-change-transform"
      >
        <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <TranslatableText text="Watch Demo" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </Button>
    </div>
  );
};

export default CTAButtons;
