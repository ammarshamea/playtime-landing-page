export type ChatSender = "user" | "support" | "system";

export type ChatMessageStatus = "sending" | "sent" | "failed";

export type ChatMessage = {
  id: string;
  sender: ChatSender;
  text: string;
  createdAt: Date;
  status?: ChatMessageStatus;
};
