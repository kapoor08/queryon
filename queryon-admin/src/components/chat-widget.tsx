"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChatBubble from "./chat-bubble";
import { SAMPLE_MESSAGES } from "@/data";
import { ErrorBoundary } from "@/providers";
import { ThemeConfig } from "@/types/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useChatMessages, useChatPosition } from "@/hooks";
import { SendIcon, MessageIcon, CloseIcon } from "./icons";
import { TranslatableText } from "@/shared/elements";

interface IChatWidget {
  theme: ThemeConfig;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showNotificationBadge?: boolean;
  unreadCount?: number;
  isPreview?: boolean;
}

const ChatWidget = ({
  theme,
  position = "bottom-right",
  showNotificationBadge = false,
  unreadCount = 0,
  isPreview = false,
}: IChatWidget) => {
  const [open, setOpen] = useState(false);
  const {
    messages,
    message,
    setMessage,
    sendMessage,
    isTyping,
    messagesEndRef,
  } = useChatMessages(SAMPLE_MESSAGES);
  const { positionClasses, popoverSide, popoverAlign } = useChatPosition(
    position,
    isPreview
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  return (
    <ErrorBoundary>
      <div className={positionClasses}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                size="lg"
                className="w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 border-0"
                style={{
                  backgroundColor: theme?.colors?.primary,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme?.colors?.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme?.colors?.primary;
                }}
              >
                {open ? (
                  <CloseIcon className="!h-6 !w-6" />
                ) : (
                  <MessageIcon className="!h-6 !w-6" />
                )}
              </Button>

              {/* Notification Badge */}
              {showNotificationBadge && unreadCount > 0 && !open && (
                <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 text-white border-2 border-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="p-0 border-0 shadow-2xl"
            side={popoverSide}
            align={popoverAlign}
            sideOffset={15}
            style={{
              width: theme?.width,
              borderRadius: "16px",
              backgroundColor: theme?.colors?.background,
            }}
          >
            {/* Header */}
            <div
              className="p-4 text-white rounded-t-2xl"
              style={{
                background: `linear-gradient(135deg, ${theme?.colors?.primary} 0%, ${theme?.colors?.primaryHover} 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <MessageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      <TranslatableText text={theme.branding.supportTitle} />
                    </h3>
                    <p className="text-xs opacity-90">
                      <TranslatableText text={theme.branding.supportSubtitle} />
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <TranslatableText
                    className="text-xs font-medium"
                    text="Online"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="p-4 overflow-y-auto"
              style={{
                height: theme.height - 140,
                backgroundColor: theme?.colors?.secondary,
              }}
            >
              {messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  type={msg.type}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  status={msg.status}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start space-x-2 mb-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: theme?.colors?.primary }}
                  >
                    <TranslatableText text="CS" />
                  </div>
                  <div
                    className="px-4 py-2 rounded-2xl rounded-bl-md shadow-sm"
                    style={{
                      backgroundColor: theme?.colors?.received,
                      border: `1px solid ${theme?.colors?.border}`,
                    }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-4 border-t rounded-b-2xl"
              style={{
                backgroundColor: theme?.colors?.background,
                borderTopColor: theme?.colors?.border,
              }}
            >
              <div className="flex items-end space-x-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 resize-none rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 min-h-[40px] max-h-[100px]"
                  placeholder={theme.branding.placeholder}
                  rows={1}
                  style={{
                    border: `1px solid ${theme?.colors?.border}`,
                    backgroundColor: theme?.colors?.background,
                    color: theme?.colors?.text,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme?.colors?.primary;
                    e.target.style.boxShadow = `0 0 0 2px ${theme?.colors?.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme?.colors?.border;
                    e.target.style.boxShadow = "none";
                  }}
                />

                <Button
                  onClick={() => sendMessage(message)}
                  disabled={!message.trim()}
                  size="sm"
                  className="p-2 h-auto rounded-lg transition-colors duration-200"
                  style={{
                    backgroundColor: message.trim()
                      ? theme?.colors?.primary
                      : theme?.colors?.textSecondary,
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    if (message.trim()) {
                      e.currentTarget.style.backgroundColor =
                        theme?.colors?.primaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (message.trim()) {
                      e.currentTarget.style.backgroundColor =
                        theme?.colors?.primary;
                    }
                  }}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>

              <TranslatableText
                className="text-xs mt-2 text-center"
                style={{ color: theme?.colors?.textSecondary }}
                text={`Powered by ${theme.branding.companyName}`}
                as="p"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </ErrorBoundary>
  );
};

export default ChatWidget;
