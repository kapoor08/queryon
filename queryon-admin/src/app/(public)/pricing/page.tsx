import { Badge } from '@/components/ui/badge';
import {
  Header,
  Pricing,
  Footer,
  CTA,
  FeaturesComparison,
  FAQSection,
} from '@/components';
import { TranslatableText } from '@/shared/elements';
import { faqs, planFeatures } from '@/data';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <TranslatableText text="💰 Transparent Pricing" />
            </Badge>
            <TranslatableText
              as="h1"
              text={`Choose Your Perfect <span class="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Plan</span>`}
              className="text-5xl lg:text-6xl font-bold text-foreground mb-6"
            />
            <TranslatableText
              text="Start with our free trial and scale as you grow. All plans include
              our core AI features with no hidden fees."
              as="h1"
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Pricing Cards - Using the existing component with billing toggle */}
      <Pricing showBillingToggle={true} showTitle={false} />

      {/* Feature Comparison */}
      <FeaturesComparison features={planFeatures} />

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* CTA Section */}
      <CTA />

      <Footer />
    </div>
  );
}
