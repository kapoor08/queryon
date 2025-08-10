import {
  AnimatedBadge,
  AnimatedStats,
  CTAButtons,
  FloatingElements,
  HeroTitle,
  InteractiveDemo,
  ScrollIndicator,
} from "@/shared/base";
import { cn } from "@/lib/utils";
import { useHeroAnimations } from "@/hooks/use-hero-animations";

export function Hero() {
  const {
    isLoaded,
    activeDemo,
    setActiveDemo,
    backgroundTransform,
    gridTransform,
    mousePos,
  } = useHeroAnimations();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Optimized Background Layer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={backgroundTransform}
      >
        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-10 will-change-transform"
          style={{
            ...gridTransform,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient Orbs - GPU Accelerated */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse will-change-transform" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse will-change-transform"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-orange-500/5 rounded-full blur-2xl animate-pulse will-change-transform"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Floating Elements - Optimized */}
      <FloatingElements mousePos={mousePos} />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div
            className={cn(
              "space-y-8 transition-all duration-1000 ease-out",
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            )}
          >
            {/* Animated Badge */}
            <AnimatedBadge />

            {/* Hero Title */}
            <HeroTitle />

            {/* CTA Buttons */}
            <CTAButtons />

            {/* Animated Stats */}
            <AnimatedStats isLoaded={isLoaded} />
          </div>

          {/* Right Column - Interactive Demo */}
          <InteractiveDemo
            isLoaded={isLoaded}
            activeDemo={activeDemo}
            setActiveDemo={setActiveDemo}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}

export default Hero;
