import { TranslatableText } from "@/shared/elements";

const HeroTitle = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
        <span className="block">
          <TranslatableText text="Transform Your" />
        </span>
        <span className="relative block">
          <TranslatableText
            text="Customer Support"
            className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient"
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient 3s ease infinite",
            }}
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-blue-400/10 blur-xl animate-pulse rounded-lg" />
        </span>
        <span className="block">
          <TranslatableText text="with AI" />
        </span>
      </h1>

      <TranslatableText
        text="Deploy intelligent chat widgets in minutes. Provide 24/7 customer support with AI that understands your business and delights your customers."
        as="p"
        className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl font-light"
      />
    </div>
  );
};

export default HeroTitle;
