import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/@extended/ui/button";
import { WidgetConfig, ChatBubble } from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SendIcon from "@/assets/svg/send.svg?react";
import MessageIcon from "@/assets/svg/message.svg?react";
import CloseIcon from "@/assets/svg/close.svg?react";
import tailwindStyles from "@/index.css?inline";

// Professional sample conversation for demo
const SAMPLE_MESSAGES = [
  {
    type: "received" as const,
    message: "Hello! Welcome to our support chat. How can I assist you today?",
  },
  { type: "sent" as const, message: "Hi, I have a question about your pricing plans." },
  {
    type: "received" as const,
    message:
      "I'd be happy to help you with that! Are you looking for information about our basic, professional, or enterprise plans?",
  },
  { type: "sent" as const, message: "I'm interested in the professional plan features." },
  {
    type: "received" as const,
    message:
      "Great choice! The professional plan includes advanced analytics, priority support, and unlimited integrations. Would you like me to schedule a demo for you?",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatWidget = (props: any) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Get theme colors
  const theme = WidgetConfig.colors;
  const branding = WidgetConfig.branding;

  // eslint-disable-next-line no-console
  console.log(props, "props in chat widget");

  useEffect(() => {
    if (open && ref.current) {
      // Scroll to the bottom of the chat widget when it is opened
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [open, messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { type: "sent", message: message.trim() }]);
      setMessage("");

      // Simulate a response after a brief delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "received",
            message: "Thank you for your message. Our team will get back to you shortly!",
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <style>{tailwindStyles}</style>
      <ErrorBoundary>
        {/* Widget class is for giving the styles encapsulated to the widget */}
        <div className="fixed bottom-4 right-4 z-1000 widget">
          <Popover onOpenChange={(isOpen) => setOpen(isOpen)}>
            <PopoverTrigger>
              <Button
                type="button"
                variant="ringHover"
                size="icon"
                className="rounded-full h-14 w-14 text-white shadow-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.primary,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                }}>
                {open ? <CloseIcon className="h-6 w-6" /> : <MessageIcon className="h-6 w-6" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="!p-0 custom-scrollbars widget shadow-xl border-0"
              side="top"
              align="end"
              sideOffset={15}
              alignOffset={5}
              style={{
                maxWidth: WidgetConfig.width,
                width: WidgetConfig.width,
                borderRadius: "16px",
                backgroundColor: theme.background,
              }}>
              <style>{tailwindStyles}</style>

              {/* Header */}
              <div
                className="text-white p-4 rounded-t-2xl"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryHover})`,
                }}>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}>
                    <MessageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{branding.supportTitle}</h3>
                    <p className="text-xs opacity-80">{branding.supportSubtitle}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={ref}
                className="mx-auto relative overflow-y-auto"
                style={{
                  height: WidgetConfig.height - 140,
                  maxWidth: WidgetConfig.width,
                  backgroundColor: theme.secondary,
                }}>
                <div className="p-4 flex flex-col space-y-3">
                  {messages.map((msg, index) => (
                    <ChatBubble key={index} type={msg.type} message={msg.message} />
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div
                className="border-t p-3 rounded-b-2xl"
                style={{
                  backgroundColor: theme.background,
                  borderTopColor: theme.border,
                }}>
                <div className="flex items-end space-x-2">
                  <TextareaAutosize
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                    placeholder={branding.placeholder}
                    minRows={1}
                    maxRows={3}
                    style={{
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.primary;
                      e.target.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="rounded-lg p-2 transition-colors duration-200"
                    size="sm"
                    style={{
                      backgroundColor: message.trim() ? theme.primary : theme.textSecondary,
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      if (message.trim()) {
                        e.currentTarget.style.backgroundColor = theme.primaryHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (message.trim()) {
                        e.currentTarget.style.backgroundColor = theme.primary;
                      }
                    }}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: theme.textSecondary }}>
                  Powered by {branding.companyName} • {branding.footerText}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default ChatWidget;
