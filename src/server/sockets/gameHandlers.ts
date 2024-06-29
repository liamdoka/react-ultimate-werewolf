import { Socket } from "socket.io";
import { Lobby, ServerAction } from "../../lib/types";
import { getRoomCode, shuffled } from "../../lib/utils";
import { handleUpdateLobby } from "./lobbyHandlers";
import { io } from "../server";

export const handleStartGame = (socket: Socket, payload: Lobby) => {
  const roomCode = getRoomCode(socket);
  console.log(`starting room ${roomCode}`);

  handleUpdateLobby(socket, payload);
};

export const handleDealCards = (_socket: Socket, payload: Lobby) => {
  const { deck, players } = payload;

  const shuffledCards = shuffled(deck.slice(1, players.length));
  shuffledCards.unshift(deck[0]);

  const shuffledPlayers = shuffled(players);

  for (let i = 0; i < shuffledPlayers.length; i++) {
    const player = shuffledPlayers[i];
    const card = shuffledCards[i];

    io.to(player.socketId).emit(ServerAction.SetCard, card);
  }
};
