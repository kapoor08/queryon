import { Card, CardContent } from '@/components/ui/card';
import { Check, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { TranslatableText } from '@/shared/elements';
import { JSX } from 'react';

interface FeatureItem {
  name: string;
  starter: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

interface FeaturesComparisonProps {
  features: FeatureCategory[];
}

const iconMap: Record<number, JSX.Element> = {
  0: <MessageSquare className="w-5 h-5 text-primary" />,
  1: <Users className="w-5 h-5 text-primary" />,
  2: <BarChart3 className="w-5 h-5 text-primary" />,
};

const FeaturesComparison = ({ features }: FeaturesComparisonProps) => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <TranslatableText
            as="h2"
            text="Compare All Features"
            className="text-3xl font-bold text-foreground mb-4"
          />
          <TranslatableText
            as="p"
            className="text-muted-foreground"
            text="See exactly what's included in each plan"
          />
        </div>

        <div className="max-w-6xl mx-auto">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                {iconMap[categoryIndex]}
                <TranslatableText text={category.category} />
              </h3>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium text-foreground">
                            <TranslatableText text="Feature" />
                          </th>
                          <th className="text-center p-4 font-medium text-foreground">
                            <TranslatableText text="Starter" />
                          </th>
                          <th className="text-center p-4 font-medium text-foreground">
                            <TranslatableText text="Professional" />
                          </th>
                          <th className="text-center p-4 font-medium text-foreground">
                            <TranslatableText text="Enterprise" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item, itemIndex) => (
                          <tr
                            key={itemIndex}
                            className="border-b last:border-b-0"
                          >
                            <td className="p-4 font-medium text-foreground">
                              <TranslatableText text={item.name} />
                            </td>
                            {(['starter', 'pro', 'enterprise'] as const).map(
                              (tier) => (
                                <td key={tier} className="p-4 text-center">
                                  {typeof item[tier] === 'boolean' ? (
                                    item[tier] ? (
                                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                                    ) : (
                                      <span className="text-muted-foreground">
                                        —
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-foreground">
                                      <TranslatableText text={item[tier]} />
                                    </span>
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesComparison;
