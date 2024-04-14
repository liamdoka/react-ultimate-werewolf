export type MessageType = "CHAT" | "OTHER";

export interface Message {
  type: MessageType;
  payload: any;
}
