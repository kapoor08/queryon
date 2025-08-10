import { useEffect, useRef, useState } from "react";
import { ChatMessage, MessageStatus } from "@/types/chat";

export function useChatMessages(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      type: "sent",
      message: text.trim(),
      timestamp: formatTime(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Status progression
    setTimeout(() => updateLastMessageStatus("sent"), 500);
    setTimeout(() => updateLastMessageStatus("delivered"), 1000);

    // Simulated reply
    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => {
      setIsTyping(false);
      updateLastMessageStatus("read");
      addMessage({
        type: "received",
        message:
          "Thank you for your message! Our team will get back to you shortly with detailed information.",
        timestamp: formatTime(),
        status: "delivered",
      });
    }, 3000);
  };

  const updateLastMessageStatus = (status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, status } : msg))
    );
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    messages,
    message,
    setMessage,
    sendMessage,
    isTyping,
    messagesEndRef,
  };
}
