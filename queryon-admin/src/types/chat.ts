export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export type ChatMessage =
  | {
      type: "received";
      message: string;
      timestamp: string;
      status: MessageStatus;
    }
  | {
      type: "sent";
      message: string;
      timestamp: string;
      status: MessageStatus;
    };
