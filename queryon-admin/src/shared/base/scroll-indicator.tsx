const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce will-change-transform">
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center backdrop-blur-sm">
        <div className="w-1 h-3 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full mt-2 animate-pulse" />
      </div>
    </div>
  );
};

export default ScrollIndicator;
