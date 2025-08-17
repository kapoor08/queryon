// ChatBubble.tsx
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  type?: "sent" | "received";
  timestamp?: string;
  avatar?: string;
  theme?: {
    colors?: {
      primary?: string;
      sent?: string;
      received?: string;
      text?: string;
      textSecondary?: string;
      border?: string;
    };
  }; // Accept theme as prop
}

const ChatBubble = ({ message, type = "sent", timestamp, avatar, theme }: ChatBubbleProps) => {
  const isReceived = type === "received";

  // Use theme colors if provided, otherwise fallback to default
  const themeColors = theme?.colors || {
    primary: "#059669",
    sent: "#059669",
    received: "#f3f4f6",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#d1d5db",
  };

  return (
    <div
      className={cn("flex items-start space-x-2", {
        "flex-row-reverse space-x-reverse": type === "sent",
      })}>
      {/* Avatar for received messages */}
      {isReceived && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: themeColors.primary }}>
          {avatar ? (
            <img src={avatar} alt="Support" className="w-8 h-8 rounded-full" />
          ) : (
            <span className="text-white text-xs font-medium">CS</span>
          )}
        </div>
      )}

      <div
        className={cn("flex flex-col", {
          "items-end": type === "sent",
          "items-start": isReceived,
        })}>
        {/* Message bubble */}
        <div
          className={cn("px-4 py-2 rounded-2xl text-sm max-w-[240px] word-wrap break-words", {
            "rounded-br-md": type === "sent",
            "rounded-bl-md shadow-sm": isReceived,
          })}
          style={{
            backgroundColor: type === "sent" ? themeColors.sent : themeColors.received,
            color: type === "sent" ? "white" : themeColors.text,
            border: type === "received" ? `1px solid ${themeColors.border}` : "none",
          }}>
          {message}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs mt-1 px-1" style={{ color: themeColors.textSecondary }}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
