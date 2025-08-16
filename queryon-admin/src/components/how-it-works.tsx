'use client';

import { useEffect, useState } from 'react';
import FeatureCards from '@/shared/base/feature-cards';
import ConnectionSystem from '@/shared/base/connection-system';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { steps } from '@/data';
import { TranslatableText } from '@/shared/elements/client';

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-900/5 to-emerald-900/5"></div>

        {/* Floating Particles */}
        {isVisible && (
          <>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-400/40 rounded-full animate-float-delayed"></div>
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/35 rounded-full animate-float-slow"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={cn(
            'text-center mb-20 transition-all duration-1000',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <TranslatableText
            text="How It Works"
            as="h2"
            className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]"
          />
          <TranslatableText
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            text="Get your AI-powered chat widget up and running in just four simple
            steps"
            as="p"
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Advanced Connection System */}
          <ConnectionSystem
            steps={steps}
            isVisible={isVisible}
            activeStep={activeStep}
          />

          {/* Step Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <FeatureCards
                key={index}
                activeStep={activeStep}
                isVisible={isVisible}
                setActiveStep={setActiveStep}
                step={step}
                steps={steps}
                index={index}
              />
            ))}
          </div>

          {/* Progress Indicators */}
          <div
            className={cn(
              'hidden lg:flex justify-center mt-16 space-x-4 transition-all duration-1000',
              isVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  activeStep === index
                    ? step.bgColor + ' scale-125'
                    : 'bg-slate-600 hover:bg-slate-500'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
