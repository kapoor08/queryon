/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// ChatWidget.tsx - FIXED VERSION
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/@extended/ui/button";
import { ChatBubble } from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SendIcon from "@/assets/svg/send.svg?react";
import MessageIcon from "@/assets/svg/message.svg?react";
import CloseIcon from "@/assets/svg/close.svg?react";
import tailwindStyles from "@/index.css?inline";
import { ForestGreenTheme } from "./config";

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

interface ThemeConfig {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    border: string;
    text: string;
    textSecondary: string;
    received?: string;
    sent?: string;
    accent?: string;
    surface?: string;
  };
  branding: {
    supportTitle: string;
    supportSubtitle: string;
    placeholder: string;
    companyName: string;
    footerText: string;
  };
  width: number;
  height: number;
}

interface ChatWidgetProps {
  theme?: ThemeConfig;
  apiEndpoint?: string;
  webhookUrl?: string;
  onMessageSent?: (message: string) => void;
  onWidgetToggle?: (isOpen: boolean) => void;
}

const ChatWidget = ({
  theme,
  apiEndpoint,
  webhookUrl,
  onMessageSent,
  onWidgetToggle,
}: ChatWidgetProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Create a safe theme configuration with proper fallbacks
  const WidgetConfig = React.useMemo(() => {
    console.log("🎨 Processing theme in ChatWidget:", theme);

    const baseTheme = theme || ForestGreenTheme;
    console.log("🏗️ Base theme:", baseTheme);

    // Ensure all required properties exist with fallbacks
    const safeTheme = {
      colors: {
        primary: baseTheme?.colors?.primary || "#059669",
        primaryHover: baseTheme?.colors?.primaryHover || "#047857",
        secondary: baseTheme?.colors?.secondary || "#f0fdf4",
        background: baseTheme?.colors?.background || "#ffffff",
        border: baseTheme?.colors?.border || "#d1d5db",
        text: baseTheme?.colors?.text || "#1f2937",
        textSecondary: baseTheme?.colors?.textSecondary || "#6b7280",
        received: baseTheme?.colors?.received || "#f3f4f6",
        sent: baseTheme?.colors?.sent || "#059669",
        accent: baseTheme?.colors?.accent || "#f59e0b",
        surface: baseTheme?.colors?.surface || "#fefefe",
      },
      branding: {
        supportTitle: baseTheme?.branding?.supportTitle || "Customer Support",
        supportSubtitle: baseTheme?.branding?.supportSubtitle || "We're here to help",
        placeholder: baseTheme?.branding?.placeholder || "Type your message...",
        companyName: baseTheme?.branding?.companyName || "Your Company",
        footerText: baseTheme?.branding?.footerText || "We typically reply in a few minutes",
      },
      width: baseTheme?.width || 360,
      height: baseTheme?.height || 500,
    };

    console.log("✅ Safe theme created:", safeTheme);
    return safeTheme;
  }, [theme]);

  // Get theme colors with guaranteed safety
  const themeColors = WidgetConfig.colors;
  const branding = WidgetConfig.branding;

  // Log to verify everything is working
  console.log("🎯 Theme colors:", themeColors);
  console.log("🏷️ Branding:", branding);

  useEffect(() => {
    if (open && ref.current) {
      // Scroll to the bottom of the chat widget when it is opened
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [open, messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { type: "sent" as const, message: message.trim() };
      setMessages((prev) => [...prev, userMessage]);

      // Call the onMessageSent callback if provided
      if (onMessageSent) {
        onMessageSent(message.trim());
      }

      const currentMessage = message.trim();
      setMessage("");

      // If API endpoint is provided, send the message there
      if (apiEndpoint) {
        try {
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentMessage,
              timestamp: new Date().toISOString(),
              sessionId: generateSessionId(),
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.reply) {
              setMessages((prev) => [
                ...prev,
                {
                  type: "received",
                  message: data.reply,
                },
              ]);
            }
          }
        } catch (error) {
          console.error("Error sending message to API:", error);
        }
      }

      // If webhook URL is provided, send notification there
      if (webhookUrl) {
        try {
          fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentMessage,
              timestamp: new Date().toISOString(),
              sessionId: generateSessionId(),
              type: "new_message",
            }),
          });
        } catch (error) {
          console.error("Error sending webhook:", error);
        }
      }

      // Default auto-response if no API endpoint
      if (!apiEndpoint) {
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
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggle = (isOpen: boolean) => {
    setOpen(isOpen);
    if (onWidgetToggle) {
      onWidgetToggle(isOpen);
    }
  };

  const generateSessionId = () => {
    return "session_" + Math.random().toString(36).substr(2, 9);
  };

  // Verify theme colors before rendering
  if (!themeColors.primary) {
    console.error("❌ Theme colors missing primary color:", themeColors);
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "red",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          zIndex: 9999,
        }}>
        Theme Error
      </div>
    );
  }

  return (
    <>
      <style>{tailwindStyles}</style>
      <ErrorBoundary>
        {/* Widget class is for giving the styles encapsulated to the widget */}
        <div className="fixed bottom-4 right-4 z-1000 widget">
          <Popover onOpenChange={handleToggle}>
            <PopoverTrigger>
              <Button
                type="button"
                variant="ringHover"
                size="icon"
                className="rounded-full h-14 w-14 text-white shadow-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: themeColors.primary,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary;
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
                backgroundColor: themeColors.background,
              }}>
              <style>{tailwindStyles}</style>

              {/* Header */}
              <div
                className="text-white p-4 rounded-t-2xl"
                style={{
                  background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.primaryHover})`,
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
                  backgroundColor: themeColors.secondary,
                }}>
                <div className="p-4 flex flex-col space-y-3">
                  {messages.map((msg, index) => (
                    <ChatBubble
                      key={index}
                      type={msg.type}
                      message={msg.message}
                      theme={WidgetConfig}
                    />
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div
                className="border-t p-3 rounded-b-2xl"
                style={{
                  backgroundColor: themeColors.background,
                  borderTopColor: themeColors.border,
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
                      border: `1px solid ${themeColors.border}`,
                      backgroundColor: themeColors.background,
                      color: themeColors.text,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = themeColors.primary;
                      e.target.style.boxShadow = `0 0 0 2px ${themeColors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = themeColors.border;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="rounded-lg p-2 transition-colors duration-200"
                    size="sm"
                    style={{
                      backgroundColor: message.trim()
                        ? themeColors.primary
                        : themeColors.textSecondary,
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      if (message.trim()) {
                        e.currentTarget.style.backgroundColor = themeColors.primaryHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (message.trim()) {
                        e.currentTarget.style.backgroundColor = themeColors.primary;
                      }
                    }}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p
                  className="text-xs mt-2 text-center"
                  style={{ color: themeColors.textSecondary }}>
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
