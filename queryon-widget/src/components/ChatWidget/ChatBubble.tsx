import { cn } from "@/lib/utils";
import { WidgetConfig } from "./config";

interface ChatBubbleProps {
  message: string;
  type?: "sent" | "received";
  timestamp?: string;
  avatar?: string;
}

const ChatBubble = ({ message, type = "sent", timestamp, avatar }: ChatBubbleProps) => {
  const isReceived = type === "received";
  const theme = WidgetConfig.colors;

  return (
    <div
      className={cn("flex items-start space-x-2", {
        "flex-row-reverse space-x-reverse": type === "sent",
      })}>
      {/* Avatar for received messages */}
      {isReceived && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: theme.primary }}>
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
            backgroundColor: type === "sent" ? theme.sent : theme.received,
            color: type === "sent" ? "white" : theme.text,
            border: type === "received" ? `1px solid ${theme.border}` : "none",
          }}>
          {message}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs mt-1 px-1" style={{ color: theme.textSecondary }}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
