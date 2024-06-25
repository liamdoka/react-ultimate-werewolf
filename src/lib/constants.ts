import { GameState, Lobby } from "./types";

export const DISCUSSION_TIME_STEP_SIZE = 15;
export const MIN_DISCUSSION_TIME = 15;
export const MAX_DISCUSSION_TIME = 300;
const DEFAULT_DISCUSSION_TIME = 60;

export const COUNTDOWN_TIME = 3;
export const MIN_RIVER_CARDS = 3;
export const MIN_PLAYERS = 1;

export const defaultRoom: Lobby = {
  players: [],
  deck: [0],
  admin: "",
  state: GameState.Waiting,
  discussionTime: DEFAULT_DISCUSSION_TIME,
};
