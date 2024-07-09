import { Socket } from "socket.io";
import {
  CardType,
  Game,
  GameAction,
  GameState,
  Lobby,
  OptNumber,
  OptString,
} from "../../lib/types";
import { createPlayerTurns, getRoomCode, shuffled } from "../../lib/utils";
import { handleUpdateLobby } from "./lobbyHandlers";
import { activeGames, activeRooms } from "../server";
import { defaultDeck } from "../../lib/allCards";

export const handleStartGame = (socket: Socket, payload: Lobby) => {
  const roomCode = getRoomCode(socket);
  console.log(`starting room ${roomCode}`);

  dealCards(socket, payload);
  handleUpdateLobby(socket, payload);
};

export const dealCards = (socket: Socket, payload: Lobby) => {
  const { deck, players } = payload;
  const roomCode = getRoomCode(socket);
  const actualCards = deck.map((index) => defaultDeck[index]);

  if (activeRooms.get(roomCode) == null) throw Error("Room does not exist");

  // shuffle all except the first card
  const shuffledPlayers = shuffled(players);
  const shuffledCards = shuffled(actualCards.slice(1, actualCards.length));
  shuffledCards.unshift(CardType.BluSpy);

  const playerCards: Map<string, CardType> = new Map();
  const riverCards = [];

  for (let i = 0; i < shuffledCards.length; i++) {
    const card = shuffledCards[i];

    if (i < shuffledPlayers.length) {
      const player = shuffledPlayers[i];
      playerCards.set(player.socketId, card);
    } else {
      riverCards.push(card);
    }
  }

  const playerTurns = createPlayerTurns(playerCards);

  const newGame: Game = {
    startCards: playerCards,
    endCards: new Map<string, CardType>(),
    riverCards: riverCards,
    turns: playerTurns,
    state: GameState.Dealing,
  };

  activeGames.set(roomCode, newGame);
};

export const handleEndTurn = (socket: Socket) => {
  socket.emit(GameAction.EndTurn);
};

export const handleSetCard = (socket: Socket) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  socket.emit(GameAction.SetCard, card);
};

export const handleCheckCard = (socket: Socket) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.endCards.get(socket.id) ?? game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  socket.emit(GameAction.CheckCard, card);
};

export const handleCheckRiverSingle = (socket: Socket, index: number) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  if (index < 0 || index >= game.riverCards.length) throw RangeError();
  const card = game.riverCards[index];

  socket.emit(GameAction.CheckRiverSingle, card);
};

export const handleCheckOneOrTwo = (
  socket: Socket,
  target: OptString,
  riverOne: OptNumber,
  riverTwo: OptNumber,
) => {
  if (target != null && riverOne != null && riverTwo != null)
    throw Error("The function is literally called check one OR two.");

  if ((riverOne == null) !== (riverTwo == null))
    throw Error("Must supply TWO river cards");

  if (riverOne === riverTwo) throw Error("River Cards must be different.");

  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  if (riverOne != null && riverTwo != null) {
    if (riverOne < 0 || riverOne >= game.riverCards.length) throw RangeError();
    const cardOne = game.riverCards[riverOne];

    if (riverTwo < 0 || riverTwo >= game.riverCards.length) throw RangeError();
    const cardTwo = game.riverCards[riverTwo];

    socket.emit(GameAction.CheckOneOrTwo, [cardOne, cardTwo]);
  } else if (target != null) {
    const targetCard = game.endCards.get(target) ?? game.startCards.get(target);
    if (targetCard == null) throw Error("Target player does not exist");

    socket.emit(GameAction.CheckOneOrTwo, [targetCard]);
  }
};

export const handleSwapWithPlayer = (socket: Socket, target: string) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.endCards.get(socket.id) ?? game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  const targetCard = game.endCards.get(target) ?? game.startCards.get(target);
  if (targetCard == null) throw Error("Target player does not exist");

  game.endCards.set(target, card);
  game.endCards.set(socket.id, targetCard);
};

export const handleSwapWithRiver = (socket: Socket, index: number) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.endCards.get(socket.id) ?? game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  if (index >= game.riverCards.length || index < 0) throw RangeError();
  const targetCard = game.riverCards[index];
  if (targetCard == null) throw Error("Target card does not exist");

  game.endCards.set(socket.id, targetCard);
};

export const handleSwapOtherPlayers = (
  socket: Socket,
  targetOne: string,
  targetTwo: string,
) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const targetOneCard =
    game.endCards.get(targetOne) ?? game.startCards.get(targetOne);
  if (targetOneCard == null) throw Error("Target player does not exist");

  const targetTwoCard =
    game.endCards.get(targetTwo) ?? game.startCards.get(targetTwo);
  if (targetTwoCard == null) throw Error("Target player does not exist");

  game.endCards.set(targetOne, targetTwoCard);
  game.endCards.set(targetTwo, targetOneCard);
};

export const handleAssumeForm = (socket: Socket, target: string) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const targetCard = game.endCards.get(target) ?? game.startCards.get(target);
  if (targetCard == null) throw Error("Target player does not exist");

  for (let i = 0; i < game.turns.length; i++) {
    if (game.turns[i].includes(target)) {
      game.turns[i].push(socket.id);
      break;
    }
  }

  game.endCards.set(socket.id, targetCard);
};
