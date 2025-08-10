import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TranslatableText } from "../elements";

interface IPricingCardsProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  scale?: string;
}

interface IPricingProps {
  plan: IPricingCardsProps;
}

const PricingCards = ({ plan }: IPricingProps) => {
  return (
    <Card
      className={cn(
        plan.scale,
        "transition-all duration-500 hover:shadow-2xl",
        plan.popular
          ? "border-primary shadow-xl bg-gradient-to-b from-primary/5 to-primary/10 relative z-10"
          : "border-border hover:border-primary/50"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <TranslatableText text="Most Popular" />
          </Badge>
        </div>
      )}

      <CardHeader className={cn("text-center", plan.popular ? "pt-8" : "pt-6")}>
        <CardTitle className="text-2xl font-bold text-foreground">
          <TranslatableText text={plan.name} />
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-2">
          <TranslatableText text={plan.description} />
        </CardDescription>
        <div className="mt-6">
          <span className="text-4xl font-bold text-foreground">
            {plan.price}
          </span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {plan.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <TranslatableText text={feature} className="text-foreground" />
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button
          className={cn(
            "w-full",
            plan.popular
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          )}
          size="lg"
        >
          <TranslatableText text="Get Started" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCards;
