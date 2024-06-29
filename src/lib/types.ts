export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  ChatMessage = "ChatMessage",
  SyncLobby = "SyncLobby",
  UpdateLobby = "UpdateLobby",
  StartGame = "StartGame",
  SetCard = "SetCard",
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
  playerCards: Map<string, CardType>;
  // Game State Probably
  // other stuff
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
