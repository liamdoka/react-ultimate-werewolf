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

export enum CardType {
  BluSpy,
  Demoman,
  Engineer,
  Heavy,
  Medic,
  Pyro,
  Scout,
  Sniper,
  Soldier,
  Spy,
}

export interface CardDetails {
  name: string;
  img: string;
  details: string;
  utility: string;
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
  deck: CardType[];
  state: GameState;
}

export interface ChatMessage {
  message: string;
  room: string;
  sender: string;
  iat: number;
}
