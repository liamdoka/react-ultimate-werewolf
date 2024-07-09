export enum ServerAction {
  CreateRoom = "CreateRoom",
  JoinRoom = "JoinRoom",
  JoinRoomCallback = "JoinRoomCallback",
  ChatMessage = "ChatMessage",
  SyncLobby = "SyncLobby",
  UpdateLobby = "UpdateLobby",
  StartGame = "StartGame",
}

export enum LobbyState {
  Waiting,
  Starting,
  Running,
  Ended,
}

export enum GameState {
  Dealing,
  Playing,
  Discussing,
  Voting,
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
  SetCard = "SetCard",
  CheckCard = "CheckCard",
  CheckRiverSingle = "CheckRiverSingle",
  CheckOneOrTwo = "CheckOneOrTwo",
  SwapWithPlayer = "SwapWithPlayer",
  SwapWithRiver = "SwapWithRiver",
  SwapOtherPlayers = "SwapOtherPlayers",
  AssumeForm = "AssumeForm",
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
  action?: GameAction;
}

export interface LoginRequest {
  roomCode: string;
  nickname: string;
}

export interface Lobby {
  players: Player[];
  deck: CardType[];
  admin: string;
  state: LobbyState;
  discussionTime: number;
}

export interface Game {
  // socketID => CardType
  startCards: Map<string, CardType>;
  endCards: Map<string, CardType>;
  riverCards: CardType[];
  turns: string[][];
  state: GameState;
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
