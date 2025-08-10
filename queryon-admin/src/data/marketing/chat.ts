import { ChatMessage } from "@/types/chat";

export const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    type: "received",
    message: "Hello! Welcome to our support chat. How can I assist you today?",
    timestamp: "2:34 PM",
    status: "read",
  },
  {
    type: "sent",
    message: "Hi, I have a question about your pricing plans.",
    timestamp: "2:35 PM",
    status: "read",
  },
  {
    type: "received",
    message:
      "I'd be happy to help you with that! Are you looking for information about our basic, professional, or enterprise plans?",
    timestamp: "2:35 PM",
    status: "read",
  },
  {
    type: "sent",
    message: "I'm interested in the professional plan features.",
    timestamp: "2:36 PM",
    status: "read",
  },
  {
    type: "received",
    message:
      "Great choice! The professional plan includes advanced analytics, priority support, and unlimited integrations. Would you like me to schedule a demo for you?",
    timestamp: "2:36 PM",
    status: "delivered",
  },
];
