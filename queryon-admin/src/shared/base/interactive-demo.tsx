import ChatWidget from "@/components/chat-widget";
import { ALL_THEMES } from "@/data";
import { cn } from "@/lib/utils";
import { ICommonTypes } from "@/types/base";
import { Sparkles, Star, Users } from "lucide-react";
import { TranslatableText } from "../elements";

const InteractiveDemo = ({
  isLoaded,
  activeDemo,
  setActiveDemo,
}: ICommonTypes) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-1000 ease-out delay-300",
        isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      )}
    >
      {/* Demo Container */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 animate-pulse will-change-transform" />

        {/* Main Demo */}
        <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl group-hover:border-slate-600/70 transition-all duration-500 will-change-transform">
          {/* Browser Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse will-change-transform" />
              <div
                className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse will-change-transform"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-3 h-3 bg-green-500 rounded-full animate-pulse will-change-transform"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <div className="flex-1 bg-slate-700/50 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="text-slate-400 text-sm font-mono">
                https://your-website.com
              </span>
            </div>
          </div>

          {/* Website Content */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 space-y-4 mb-6 backdrop-blur-sm border border-slate-600/20">
            {/* Header */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse will-change-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  <TranslatableText text="Welcome to Our Platform" />
                </h3>
                <p className="text-slate-300 text-sm">
                  <TranslatableText text="Experience next-generation customer support" />
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 leading-relaxed">
              <TranslatableText
                text="Our AI-powered chat widget provides instant, intelligent responses
              to your customers' questions, available 24/7 with human-like
              understanding and contextual awareness."
              />
            </p>

            {/* Live Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <Users className="w-4 h-4" />
                <TranslatableText
                  text="1,247 online"
                  as="span"
                  className="font-medium"
                />
              </div>
              <div className="flex items-center space-x-2 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                <Star className="w-4 h-4 fill-current animate-pulse" />
                <TranslatableText
                  className="font-medium"
                  text="4.9/5 rating"
                  as="span"
                />
              </div>
            </div>
          </div>

          {/* Live Chat Widget Demo */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-xl animate-pulse blur-sm" />
            <div className="relative">
              <ChatWidget
                theme={ALL_THEMES[activeDemo]}
                position="bottom-right"
              />
            </div>
          </div>

          {/* Demo Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setActiveDemo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  activeDemo === index
                    ? "bg-emerald-400 scale-125"
                    : "bg-slate-600 hover:bg-slate-500"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
