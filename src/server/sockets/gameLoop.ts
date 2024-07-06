import { Socket } from "socket.io";
import { copyOf, getRoomCode } from "../../lib/utils";
import { activeGames } from "../server";
import {
  CardType,
  Game,
  GameAction,
  GameState,
  ServerAction,
} from "../../lib/types";

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
      handlePlayerTurn(socket, game, currentTurn);
    }

    const newGame: Game = {
      ...game,
      turns: turnsRemaining,
    };
    activeGames.set(roomCode, newGame);
  }

  runGame(socket);
};

function handlePlayerTurn(socket: Socket, game, currentTurn: string[]) {
  const playerOne = currentTurn[0];
  const cardType =
    game.endCard.get(playerOne) ?? game.startCards.get(playerOne);

  switch (cardType) {
    case CardType.BluSpy:
      socket.to(currentTurn).emit(ServerAction.CheckRiver);
      return;
    default:
      throw new Error("Function not implemented.");
  }
}
