export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  ChatMessage = "ChatMessage",
  UpdateLobby = "UpdateLobby",
}

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

export interface Lobby {
  players: string[];
  state: GameState;
}

export interface ChatMessage {
  message: string;
  room: string;
  sender: string;
  iat: number;
}
