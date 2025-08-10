import { cn } from "@/lib/utils";
import { IFeatures } from "@/types/base";

interface ConnectionSystemProps {
  steps: IFeatures[];
  isVisible: boolean;
  activeStep: number;
}

const ConnectionSystem = ({
  steps,
  isVisible,
  activeStep,
}: ConnectionSystemProps) => {
  return (
    <div className="hidden lg:block absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-0">
      <svg className="w-full h-32" viewBox="0 0 1200 120" fill="none">
        {/* Gradients & Filters */}
        <defs>
          <linearGradient
            id="connectionGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="33%" stopColor="rgba(16, 185, 129, 0.4)" />
            <stop offset="66%" stopColor="rgba(139, 92, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.4)" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main horizontal line */}
        <line
          x1="150"
          y1="60"
          x2="1050"
          y2="60"
          stroke="url(#connectionGradient)"
          strokeWidth="3"
          filter="url(#glow)"
          className={cn(
            "transition-all duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Connection nodes + branches */}
        {steps.map((step, index) => (
          <g key={index}>
            <circle
              cx={150 + index * 300}
              cy="60"
              r={activeStep === index ? "8" : "5"}
              fill={step.particleColor}
              className={cn(
                "transition-all duration-500",
                isVisible ? "opacity-100" : "opacity-0",
                activeStep === index && "animate-pulse"
              )}
              style={{
                animationDelay: `${index * 0.2}s`,
                filter:
                  activeStep === index
                    ? "drop-shadow(0 0 10px currentColor)"
                    : "none",
              }}
            />

            <line
              x1={150 + index * 300}
              y1={index % 2 === 0 ? "56" : "64"}
              x2={150 + index * 300}
              y2={index % 2 === 0 ? "40" : "80"}
              stroke={step.particleColor}
              strokeWidth="2"
              className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-60" : "opacity-0"
              )}
              style={{ animationDelay: `${index * 0.3}s` }}
            />
          </g>
        ))}

        {/* Flowing Data Particles */}
        {isVisible && (
          <>
            <circle r="4" fill="rgba(59, 130, 246, 0.8)" filter="url(#glow)">
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M150,60 L450,60 L750,60 L1050,60"
              />
            </circle>
            <circle r="3" fill="rgba(16, 185, 129, 0.6)" filter="url(#glow)">
              <animateMotion
                dur="8s"
                repeatCount="indefinite"
                path="M150,60 L450,60 L750,60 L1050,60"
                begin="2s"
              />
            </circle>
            <circle r="2" fill="rgba(139, 92, 246, 0.7)" filter="url(#glow)">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M150,60 L450,60 L750,60 L1050,60"
                begin="4s"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
};

export default ConnectionSystem;
