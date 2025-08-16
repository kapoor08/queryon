'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { features } from '@/data';
import { Card, CardContent } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { TranslatableText } from '@/shared/elements/client';

const Features = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const { containerRef, visibleIndexes } = useIntersectionObserver(
    features.length,
    { staggerDelay: 150, threshold: 0.1 }
  );

  return (
    <section
      ref={containerRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <TranslatableText
              as="span"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase"
              text="Powerful Features"
            />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            <TranslatableText text="Everything You Need for" />{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              <TranslatableText text="Intelligent Support" />
            </span>
          </h2>
          <TranslatableText
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            text="Powerful features designed to transform how you interact with your
            customers and provide exceptional support experiences."
            as="p"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                'group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer',
                visibleIndexes.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              )}
              style={{
                transitionDelay: `${index * 100}ms`,
                boxShadow:
                  hoveredCard === index
                    ? `0 25px 50px -12px ${
                        feature.color === 'blue'
                          ? 'rgba(59, 130, 246, 0.25)'
                          : feature.color === 'emerald'
                            ? 'rgba(16, 185, 129, 0.25)'
                            : feature.color === 'purple'
                              ? 'rgba(139, 92, 246, 0.25)'
                              : feature.color === 'red'
                                ? 'rgba(239, 68, 68, 0.25)'
                                : feature.color === 'orange'
                                  ? 'rgba(249, 115, 22, 0.25)'
                                  : feature.color === 'cyan'
                                    ? 'rgba(6, 182, 212, 0.25)'
                                    : feature.color === 'indigo'
                                      ? 'rgba(99, 102, 241, 0.25)'
                                      : feature.color === 'pink'
                                        ? 'rgba(236, 72, 153, 0.25)'
                                        : 'rgba(20, 184, 166, 0.25)'
                      }`
                    : undefined,
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient Border Effect */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg',
                  feature.gradient
                )}
              />

              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent transform rotate-45 scale-150 group-hover:rotate-90 transition-transform duration-1000" />
              </div>

              <CardContent className="p-8 relative z-10">
                <div className="relative mb-6">
                  {/* Icon Container with Glow */}
                  <div
                    className={cn(
                      'w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 relative',
                      feature.gradient
                    )}
                  >
                    <feature.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    <div
                      className={cn(
                        'absolute inset-0 rounded-2xl bg-gradient-to-r blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500',
                        feature.gradient
                      )}
                    />
                  </div>
                </div>

                <TranslatableText
                  as="h3"
                  text={feature.title}
                  className="text-xl font-semibold text-foreground mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-foreground group-hover:to-muted-foreground transition-all duration-300"
                />

                <TranslatableText
                  text={feature.description}
                  as="p"
                  className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
