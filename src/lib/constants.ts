import { GameState, Lobby } from "./types";

export const DISCUSSION_TIME_STEP_SIZE = 15;
export const MIN_DISCUSSION_TIME = 15;
export const MAX_DISCUSSION_TIME = 300;

export const COUNTDOWN_TIME = 10;

export const defaultRoom: Lobby = {
  players: [],
  deck: [0],
  admin: "",
  state: GameState.Waiting,
  discussionTime: MIN_DISCUSSION_TIME,
};
