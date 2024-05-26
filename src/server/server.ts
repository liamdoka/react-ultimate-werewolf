import { DisconnectReason, Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import {
  ChatMessage,
  Lobby,
  Player,
  RoomRequest,
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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const activeRooms: Record<string, Lobby> = {};

io.on("connection", (socket) => {
  socket.on(ServerAction.CreateRoom, (payload: RoomRequest) =>
    handleCreateRoom(socket, payload),
  );
  socket.on(ServerAction.JoinRoom, (payload: RoomRequest) =>
    handleJoinRoom(socket, payload),
  );
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
      // convert maps to arrays
      const roomCode = [...socket.rooms][1];

      const currentPlayer = activeRooms[roomCode].players.find(
        (player: Player) => player.socketId == socket.id,
      );

      activeRooms[roomCode].players = activeRooms[roomCode].players.filter(
        (player: Player) => player.socketId !== socket.id,
      );

      //update all lobbies
      if (activeRooms[roomCode]) {
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
