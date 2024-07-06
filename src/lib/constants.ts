import { GamePlayer } from "../context/gameContext";
import { CardType, LobbyState, Lobby } from "./types";
import { useMediaQuery } from "./utils";

export const DISCUSSION_TIME_STEP_SIZE = 15;
export const MIN_DISCUSSION_TIME = 15;
export const MAX_DISCUSSION_TIME = 300;
const DEFAULT_DISCUSSION_TIME = 60;

export const COUNTDOWN_TIME = 3;
export const MIN_RIVER_CARDS = 3;
export const MIN_PLAYERS = 1;

export const CARD_ROTATION_FACTOR = 360;
export const CARD_ROTATION_DURATION = 5;

export const defaultRoom: Lobby = {
  players: [],
  deck: [0],
  admin: "",
  state: LobbyState.Waiting,
  discussionTime: DEFAULT_DISCUSSION_TIME,
};

export const defaultGamePlayer: GamePlayer = {
  initialCard: CardType.Empty,
  endCard: CardType.Empty,
};

export const useDesktop = () => useMediaQuery("(min-wdith: 768px)");
