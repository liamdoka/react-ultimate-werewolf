export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  ChatMessage = "ChatMessage",
  SyncLobby = "SyncLobby",
  UpdateLobby = "UpdateLobby",
}

export enum GameState {
  Waiting,
  Running,
  Ended,
}

export enum CardType {
  Empty,
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
  players: Player[];
  deck: CardType[];
  state: GameState;
  discussionTime: number;
}

export interface Player {
  socketId: string;
  nickname: string;
  card: CardType;
}

export interface ChatMessage {
  message: string;
  room: string;
  sender: string;
  iat: number;
}
