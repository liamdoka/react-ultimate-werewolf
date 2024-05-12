import { DisconnectReason, Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import { ChatMessage, Lobby, RoomRequest, ServerAction } from "../lib/types";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleChatMessage,
} from "./sockets/roomHandlers";
import {
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
  socket.on(ServerAction.UpdateLobby, () => handleUpdateLobby(socket));

  // Handle Disconnect with IO and Socket
  socket.on("disconnecting", (_payload: DisconnectReason) => {
    if (socket.rooms.size > 1) {
      // convert maps to arrays
      const currentRoom = [...socket.rooms][1];
      const activeRoom = activeRooms[currentRoom];
      const socketsInRoom = [
        ...(io.sockets.adapter.rooms!.get(currentRoom) ?? ""),
      ];

      let nickname;

      // check if socketID matches one in current room
      for (let i = 0; i < activeRoom.players.length; i++) {
        if (socketsInRoom[i] == socket.id) {
          nickname = activeRoom.players.splice(i, 1)[0];

          if (activeRoom.players.length == 0) {
            delete activeRooms[currentRoom];
          }
          break;
        }
      }

      //update all lobbies
      if (activeRooms[currentRoom]) {
        socket
          .to(currentRoom)
          .emit(ServerAction.UpdateLobby, activeRooms[currentRoom]);
        handleUserDisconnected(socket, {
          roomCode: "",
          nickname: nickname ?? "",
          ...activeRooms[currentRoom],
        });
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
