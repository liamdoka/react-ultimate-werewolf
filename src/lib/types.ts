export enum MessageType {
  Auth,
  Chat,
  Other,
}

export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  LeaveRoom = "LeaveRoom",
  ChatMessage = "ChatMessage",
}

export enum ClientAction {}

export enum GameState {
  Waiting,
  Running,
  Ended,
}

export interface StatusCallback {
  status: "failure" | "success";
}

export interface RoomRequest {
  roomCode: string;
  nickname: string;
}

export interface RoomObject {
  players: string[];
  state: GameState;
}

export interface ChatMessage {
  message: string;
  room: string;
  sender: string;
  iat: number;
}

export interface WebSocketData {
  nickname: string;
  createdAt: number;
  room: string;
  role: string | null;
}
