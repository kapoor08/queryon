'use client';
import { plans } from '@/data';
import { PricingCards } from '@/shared/base';
import { ToggleSwitch, TranslatableText } from '@/shared/elements';
import { useState } from 'react';

interface PricingProps {
  showBillingToggle?: boolean;
  showTitle?: boolean;
}

const Pricing = ({
  showBillingToggle = false,
  showTitle = true,
}: PricingProps) => {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-16">
            <TranslatableText
              as="h2"
              text="Simple, Transparent Pricing"
              className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            />
            <TranslatableText
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              as="p"
              text="Choose the perfect plan for your business. All plans include our
            core AI features."
            />
          </div>
        )}

        {showBillingToggle && (
          <ToggleSwitch
            leftLabel="Monthly"
            rightLabel="Yearly"
            checked={isYearly}
            onChange={setIsYearly}
            showBadge
            badgeText="Save 20%"
          />
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => {
            const price =
              showBillingToggle && isYearly
                ? plan.yearlyPrice
                : plan.monthlyPrice;
            const originalPrice =
              showBillingToggle && isYearly
                ? Math.round(plan.monthlyPrice * 12)
                : plan.monthlyPrice;
            const displayPeriod =
              showBillingToggle && isYearly ? '/year' : plan.period;
            return (
              <PricingCards
                key={index}
                plan={plan}
                price={price}
                originalPrice={originalPrice}
                displayPeriod={displayPeriod}
                showBillingToggle={showBillingToggle}
                isYearly={isYearly}
              />
            );
          })}
        </div>

        <div className="text-center mt-12">
          <TranslatableText
            text="All plans include a 14-day free trial. No credit card required."
            className="text-muted-foreground"
            as="p"
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
