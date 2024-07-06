import { Socket } from "socket.io";
import {
  CardType,
  Game,
  GameState,
  Lobby,
  ServerAction,
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

export const handleSetCard = (socket: Socket) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  socket.emit(ServerAction.SetCard, card);
};

export const handleCheckCard = (socket: Socket) => {
  const roomCode = getRoomCode(socket);

  const game = activeGames.get(roomCode);
  if (game == null) throw Error("Roomcode does not exist");

  const card = game.endCards.get(socket.id) ?? game.startCards.get(socket.id);
  if (card == null) throw Error("Player does not exist");

  socket.emit(ServerAction.CheckCard, card);
};

export const handleSwapCard = (socket: Socket, target: string) => {
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
