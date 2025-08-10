import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslatableText } from "@/shared/elements";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <MessageCircle className="w-16 h-16 text-white mx-auto mb-8" />
          <TranslatableText
            as="h2"
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
            text="Ready to Transform Your Customer Support?"
          />
          <TranslatableText
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            text="Join thousands of businesses already using ChatWidget to provide
            exceptional customer experiences. Start your free trial today - no
            credit card required."
            as="p"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <TranslatableText text="Start Free Trial" />
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
            >
              <TranslatableText text="Schedule Demo" />
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <TranslatableText text="14-day free trial" />
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <TranslatableText text="No credit card required" />
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <TranslatableText text="Cancel anytime" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
