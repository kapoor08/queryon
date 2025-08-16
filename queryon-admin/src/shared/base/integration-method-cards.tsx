import { Check, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { integrationMethods } from '@/data';
import { cn } from '@/lib/utils';
import { TranslatableText } from '../elements/client';

interface IIntegrationMethodCards {
  isVisible: boolean;
  copiedIndex: number | null;
  copyToClipboard: (text: string, index: number) => void;
}

const IntegrationMethodCards = ({
  isVisible,
  copiedIndex,
  copyToClipboard,
}: IIntegrationMethodCards) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-16">
      {integrationMethods.map((method, index) => (
        <Card
          key={index}
          className={cn(
            'group bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          )}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <method.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <TranslatableText
                    as="h3"
                    text={method.title}
                    className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300"
                  />
                </div>
              </div>
              <Badge
                className={`${method.badgeColor} text-white animate-pulse`}
              >
                <TranslatableText text={method.badge} />
              </Badge>
            </div>

            <TranslatableText
              text={method.description}
              as="p"
              className="text-slate-300 mb-6 group-hover:text-white transition-colors duration-300"
            />

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <pre className="relative bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-emerald-400 overflow-x-auto group-hover:border-emerald-500/50 transition-colors duration-300">
                <code className="animate-pulse">{method.code}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 border-slate-600 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-400 bg-slate-800/80 backdrop-blur-sm transition-all duration-300"
                onClick={() => copyToClipboard(method.code, index)}
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IntegrationMethodCards;
