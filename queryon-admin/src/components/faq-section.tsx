'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowBigUp } from 'lucide-react';
import { TranslatableText } from '@/shared/elements/client';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
}

const FAQSection = ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our pricing',
}: FAQSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <TranslatableText
            as="h2"
            text={title}
            className="text-3xl font-bold text-foreground mb-4"
          />
          <TranslatableText
            as="p"
            text={subtitle}
            className="text-muted-foreground"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="faq-item"
              >
                <AccordionTrigger className="text-left hover:no-underline [&>svg]:hidden cursor-pointer group">
                  <div className="flex items-center justify-between w-full pr-4">
                    <TranslatableText
                      text={faq.question}
                      className="text-lg font-medium"
                    />
                    <ArrowBigUp className="h-4 w-4 shrink-0 transition-transform duration-200 faq-icon" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <TranslatableText
                    text={faq.answer}
                    className="text-muted-foreground leading-relaxed"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <style jsx>{`
          :global(.faq-item[data-state='open'] .faq-icon) {
            transform: rotate(180deg);
          }
        `}</style>
      </div>
    </section>
  );
};

export default FAQSection;
