import { Socket } from "socket.io";
import { copyOf, getRoomCode } from "../../lib/utils";
import { activeGames, io } from "../server";
import {
  CardDetails,
  CardType,
  Game,
  GameAction,
  GameState,
  ServerAction,
} from "../../lib/types";
import { Card } from "@mui/material";
import { allCards } from "../../lib/allCards";

const runGame = (socket: Socket) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Game does not exist");

  switch (game.state) {
    case GameState.Dealing:
      return;
    case GameState.Playing:
      return handleGamePlaying(socket, roomCode, game);
    default:
      console.log("Unknown GameState");
  }
};

const handleGamePlaying = (socket: Socket, roomCode: string, game: Game) => {
  // change state on no turns left.
  if (game.turns.length < 1) {
    const newGame: Game = {
      ...game,
      state: GameState.Discussing,
    };
    activeGames.set(roomCode, newGame);
  } else {
    const turnsRemaining = copyOf(game.turns);
    const currentTurn = turnsRemaining.shift() ?? [];

    if (currentTurn.length > 0) {
      handlePlayerTurn(game, currentTurn);
    }

    const newGame: Game = {
      ...game,
      turns: turnsRemaining,
    };
    activeGames.set(roomCode, newGame);
  }

  runGame(socket);
};

function handlePlayerTurn(game: Game, currentTurn: string[]) {
  const playerOne = currentTurn[0];

  const cardType: CardType | undefined =
    game.endCards.get(playerOne) ?? game.startCards.get(playerOne);
  if (cardType == null) throw Error(`CardType: ${cardType} not found`);

  const card: CardDetails = allCards[cardType];

  if (card.action != null) {
    io.to(currentTurn).emit(card.action);
  }
}
