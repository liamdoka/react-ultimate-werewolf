export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  ChatMessage = "ChatMessage",
  SyncLobby = "SyncLobby",
  UpdateLobby = "UpdateLobby",
  StartGame = "StartGame",
  SetCard = "SetCard",
  CheckCard = "CheckCard",
  SwapCard = "SwapCard",
}

export enum GameState {
  Waiting,
  Starting,
  Running,
  Ended,
}

export enum ClientAction {
  ChangeNickname,
  ChangeRoomCode,
  ChangeSocket,
  JoinRoom,
}

export enum LobbyAction {
  UpdateIsReady,
  SyncLobby,
}

export enum GameAction {
  SetCard,
  CheckCard,
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

export interface LoginRequest {
  roomCode: string;
  nickname: string;
}

export interface Lobby {
  players: Player[];
  deck: CardType[];
  admin: string;
  state: GameState;
  discussionTime: number;
}

export interface Game {
  // socketID => CardType
  startCards: Map<string, CardType>;
  endCards: Map<string, CardType>;
  riverCards: CardType[];
  // Game State Probably
}

export interface Player {
  socketId: string;
  nickname: string;
  isReady: boolean;
}

export interface ChatMessage {
  message: string;
  room: string;
  sender: string;
  iat: number;
}
