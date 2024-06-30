import { createContext, useContext, useReducer } from "react";
import { CardType, GameAction } from "../lib/types";
import { copyOf } from "../lib/utils";
import { defaultGamePlayer } from "../lib/constants";
import { gameReducer } from "./reducers/gameReducer";

export interface GamePlayer {
  initialCard: CardType;
  endCard: CardType;
}

export type GamePayload = {
  action: GameAction;
  payload: any;
};

const GameContext = createContext<GamePlayer>(copyOf(defaultGamePlayer));
const GameDispatchContext = createContext<React.Dispatch<GamePayload>>(
  () => {},
);

export function GameProvider({ children }: any) {
  const [gamePlayer, dispatch] = useReducer(
    gameReducer,
    copyOf(defaultGamePlayer),
  );

  return (
    <GameContext.Provider value={gamePlayer}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGamePlayer() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
