import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IFeatures } from "@/types/base";
import { TranslatableText } from "../elements";

interface FeatureCardsProps {
  step: IFeatures;
  index: number;
  steps: IFeatures[];
  isVisible: boolean;
  activeStep: number;
  setActiveStep: (index: number) => void;
}

const FeatureCards = ({
  step,
  index,
  steps,
  isVisible,
  activeStep,
  setActiveStep,
}: FeatureCardsProps) => {
  return (
    <div
      className={cn(
        "relative group transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      )}
      style={{ animationDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setActiveStep(index)}
    >
      <Card
        className={cn(
          "bg-slate-800/40 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/60 transition-all duration-500 relative overflow-hidden",
          "group-hover:scale-105 group-hover:shadow-2xl",
          `group-hover:${step.glowColor}`,
          activeStep === index && `${step.glowColor} shadow-2xl scale-105`
        )}
      >
        {/* Card Glow Effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg transition-opacity duration-500",
            step.bgColor,
            "opacity-0 group-hover:opacity-20",
            activeStep === index && "opacity-20"
          )}
        />

        <CardContent className="p-8 text-center relative z-10">
          {/* Step Number */}
          <div
            className={cn(
              "absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-slate-800 border-2 rounded-full flex items-center justify-center transition-all duration-500",
              step.borderColor,
              `group-hover:${step.glowColor}`,
              "group-hover:scale-110",
              activeStep === index && `scale-110 ${step.glowColor}`
            )}
          >
            <span
              className={cn(
                "text-sm font-bold transition-all duration-300",
                step.color
              )}
            >
              {step.number}
            </span>
          </div>

          {/* Icon Container */}
          <div
            className={cn(
              "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-8 mt-8 transition-all duration-500 relative overflow-hidden",
              step.bgColor,
              "group-hover:scale-110 group-hover:rotate-3",
              activeStep === index && "scale-110 rotate-3"
            )}
          >
            {/* Icon Background */}
            <div
              className={cn(
                "absolute inset-0 opacity-50 transition-all duration-500",
                step.bgColor,
                "group-hover:opacity-75",
                activeStep === index && "opacity-75"
              )}
            />

            {/* Rotating Border */}
            <div
              className={cn(
                "absolute inset-0 rounded-3xl border-2",
                step.borderColor,
                "group-hover:animate-spin-slow",
                activeStep === index && "animate-spin-slow"
              )}
            ></div>

            <step.icon
              className={cn(
                "w-12 h-12 relative z-10 transition-all duration-500",
                step.color,
                "group-hover:scale-110",
                activeStep === index && "scale-110"
              )}
            />
          </div>

          {/* Text */}
          <TranslatableText
            className={cn(
              "text-xl font-semibold text-white mb-4 transition-all duration-300 group-hover:text-slate-100",
              activeStep === index && "text-slate-100"
            )}
            text={step.title}
            as="h3"
          />
          <TranslatableText
            className={cn(
              "text-slate-300 leading-relaxed transition-all duration-300 group-hover:text-slate-200",
              activeStep === index && "text-slate-200"
            )}
            text={step.description}
            as="p"
          />
        </CardContent>
      </Card>

      {/* Mobile Connection */}
      {index < steps.length - 1 && (
        <div className="lg:hidden flex justify-center mt-6 mb-6">
          <div
            className={cn(
              "w-1 h-12 rounded-full opacity-60 animate-pulse",
              step.bgColor
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FeatureCards;
