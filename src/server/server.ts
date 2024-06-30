import { DisconnectReason, Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import {
  ChatMessage,
  Game,
  Lobby,
  LoginRequest,
  Player,
  ServerAction,
} from "../lib/types";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleChatMessage,
} from "./sockets/roomHandlers";
import {
  handleSyncLobby,
  handleUpdateLobby,
  handleUserDisconnected,
} from "./sockets/lobbyHandlers";
import { getRoomCode } from "../lib/utils";
import {
  handleCheckCard,
  handleSetCard,
  handleStartGame,
  handleSwapCard,
} from "./sockets/gameHandlers";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const activeRooms: Map<string, Lobby> = new Map();
export const activeGames: Map<string, Game> = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // ROOM HANDLERS
  socket.on(ServerAction.CreateRoom, (payload: LoginRequest, callback) => {
    try {
      handleCreateRoom(socket, payload);
      callback(true);
    } catch (e) {
      console.error(e);
      callback(false);
    }
  });
  socket.on(ServerAction.JoinRoom, (payload: LoginRequest, callback) => {
    try {
      handleJoinRoom(socket, payload);
      callback(true);
    } catch (e) {
      console.error(e);
      callback(false);
    }
  });
  socket.on(ServerAction.ChatMessage, (payload: ChatMessage) =>
    handleChatMessage(payload),
  );

  // LOBBY HANDLERS
  socket.on(ServerAction.SyncLobby, () => handleSyncLobby(socket));
  socket.on(ServerAction.UpdateLobby, (payload: Lobby) =>
    handleUpdateLobby(socket, payload),
  );

  // GAME HANDLERS
  socket.on(ServerAction.StartGame, (payload: Lobby) =>
    handleStartGame(socket, payload),
  );
  socket.on(ServerAction.SetCard, () => handleSetCard(socket));
  socket.on(ServerAction.CheckCard, () => handleCheckCard(socket));
  socket.on(ServerAction.SwapCard, (target: string) =>
    handleSwapCard(socket, target),
  );
  // TODO: condense all swap actions into one or two functions.

  // Handle Disconnect with IO and Socket
  socket.on("disconnecting", (_: DisconnectReason) => {
    if (socket.rooms.size > 1) {
      const roomCode = getRoomCode(socket);
      const lobby = activeRooms.get(roomCode);
      if (!lobby) return;

      const currentPlayer = lobby.players.find(
        (player: Player) => player.socketId == socket.id,
      );

      lobby.players = lobby.players.filter(
        (player: Player) => player.socketId !== socket.id,
      );

      //update all lobbies
      if (lobby.players.length > 0) {
        lobby.admin = lobby.players[0].socketId;

        handleUserDisconnected(socket, {
          roomCode: roomCode,
          nickname: currentPlayer?.nickname ?? "",
        });
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
