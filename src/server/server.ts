import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import {
  ChatMessage,
  RoomObject,
  RoomRequest,
  ServerAction,
} from "../lib/types";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleChatMessage,
} from "./sockets/roomHandlers";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const activeRooms: Record<string, RoomObject> = {};

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

  console.log(activeRooms);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
