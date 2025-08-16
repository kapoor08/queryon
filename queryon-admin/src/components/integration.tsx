'use client';

import { useState } from 'react';
import { Code, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { technologies } from '@/data';
import { Card, CardContent } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { IntegrationMethodCards } from '@/shared/base';
import { TranslatableText } from '@/shared/elements/client';

const Integration = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { containerRef, visibleIndexes } = useIntersectionObserver();

  const isVisible = visibleIndexes.includes(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section
      ref={containerRef}
      className="py-24 bg-slate-900 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={cn(
            'text-center mb-16 transition-all duration-1000',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          )}
        >
          <div className="inline-flex items-center space-x-2 mb-4">
            <Code className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
              <TranslatableText text="Simple Integration" />
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            <TranslatableText text="Deploy in" />{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                <TranslatableText text="Minutes" />
              </span>
              <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-yellow-400 animate-pulse" />
            </span>
            <TranslatableText text=", Not Hours" />
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            <TranslatableText
              text="Add our intelligent chat widget to any website with just one line of
            code. No complex setup required."
            />
          </p>
        </div>

        {/* Integration Methods */}
        <IntegrationMethodCards
          isVisible={isVisible}
          copiedIndex={copiedIndex}
          copyToClipboard={copyToClipboard}
        />

        {/* Technologies */}
        <div
          className={cn(
            'mb-16 transition-all duration-1000 delay-400',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          )}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            <TranslatableText text="Built with" />{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <TranslatableText text="Modern Technology" />
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card
                key={index}
                className="group bg-slate-800/30 border-slate-700 text-center hover:bg-slate-800/50 transition-all duration-500 hover:scale-110 cursor-pointer"
              >
                <CardContent className="p-8">
                  <div className="relative mb-4">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500">
                      {tech.icon}
                    </div>
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500',
                        tech.color
                      )}
                    />
                  </div>
                  <TranslatableText
                    as="h4"
                    text={tech.name}
                    className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-300 transition-all duration-300"
                  />
                  <TranslatableText
                    as="p"
                    text={tech.description}
                    className="text-slate-300 text-sm group-hover:text-white transition-colors duration-300"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
