import { DisconnectReason, Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import {
  ChatMessage,
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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const activeRooms: Map<string, Lobby> = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on(ServerAction.CreateRoom, (payload: LoginRequest) => {
    handleCreateRoom(socket, payload);
  });
  socket.on(ServerAction.JoinRoom, (payload: LoginRequest, callback) => {
    try {
      handleJoinRoom(socket, payload);
      callback(true);
    } catch (e) {
      console.error(e);
    }
  });
  socket.on(ServerAction.ChatMessage, (payload: ChatMessage) =>
    handleChatMessage(socket, payload),
  );
  socket.on(ServerAction.SyncLobby, () => handleSyncLobby(socket));
  socket.on(ServerAction.UpdateLobby, (payload: Lobby) =>
    handleUpdateLobby(socket, payload),
  );
  // Handle Disconnect with IO and Socket
  socket.on("disconnecting", (_payload: DisconnectReason) => {
    if (socket.rooms.size > 1) {
      // get RoomCode from socket
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
