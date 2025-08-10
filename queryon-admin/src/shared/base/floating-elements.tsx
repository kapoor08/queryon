import { FLOATING_ELEMENTS } from "@/data";
import { cn } from "@/lib/utils";
import { MousePos } from "@/types/base";

interface IFloatingElements {
  mousePos: MousePos;
}

const FloatingElements = ({ mousePos }: IFloatingElements) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {FLOATING_ELEMENTS.map((element, index) => (
        <div
          key={index}
          className="absolute will-change-transform"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `translate3d(${mousePos.x * 0.01}px, ${
              mousePos.y * 0.01
            }px, 0) scale(${element.scale}) rotate(${element.rotation}deg)`,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <div
            className={cn(
              "p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 animate-float will-change-transform",
              element.color
            )}
          >
            <element.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingElements;
