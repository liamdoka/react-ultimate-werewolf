import { allCards } from "../../lib/allCards";
import { CardType, GameAction } from "../../lib/types";
import { GamePayload, GamePlayer } from "../gameContext";

export function gameReducer(state: GamePlayer, payload: GamePayload) {
  switch (payload.action) {
    case GameAction.SetCard:
      return handleSetCard(state, payload);
    case GameAction.CheckCard:
      return handleCheckCard(state, payload);
    default:
      throw Error("Unknown GameAction");
  }
}

function handleSetCard(state: GamePlayer, payload: GamePayload) {
  const card: CardType = payload.payload as CardType;

  if (typeof card != "number") throw TypeError();
  if (allCards[card] == null) throw Error("CardNum out of bounds");

  const newGamePlayer: GamePlayer = {
    ...state,
    initialCard: card,
  };

  return newGamePlayer;
}

function handleCheckCard(state: GamePlayer, payload: GamePayload) {
  const card: CardType = payload.payload as CardType;

  if (typeof card != "number") throw TypeError();
  if (allCards[card] == null) throw Error("CardNum out of bounds");

  const newGamePlayer: GamePlayer = {
    ...state,
    endCard: card,
  };

  return newGamePlayer;
}
