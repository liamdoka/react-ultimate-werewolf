import { Socket } from "socket.io";
import {
  ChatMessage,
  Lobby,
  LoginRequest,
  ServerAction,
} from "../../lib/types";
import { getRoomCode } from "../../lib/utils";
import { activeRooms, io } from "../server";

// source of truth is the server
export const handleSyncLobby = (socket: Socket) => {
  const roomCode = getRoomCode(socket);
  const lobby = activeRooms.get(roomCode);

  io.to(roomCode).emit(ServerAction.SyncLobby, lobby);
};

export const handleUserJoined = (socket: Socket, payload: LoginRequest) => {
  const roomCode = getRoomCode(socket);

  const serverChatMessage: ChatMessage = {
    sender: "",
    room: roomCode,
    message: `${payload.nickname} joined the lobby`,
    iat: Date.now(),
  };

  socket.to(roomCode).emit(ServerAction.ChatMessage, serverChatMessage);
  handleSyncLobby(socket);
};

export const handleUserDisconnected = (
  socket: Socket,
  payload: LoginRequest,
) => {
  const roomCode = payload.roomCode ?? getRoomCode(socket);

  const serverChatMessage: ChatMessage = {
    sender: "",
    room: roomCode,
    message: `${payload.nickname} left the lobby`,
    iat: Date.now(),
  };

  io.to(roomCode).emit(ServerAction.ChatMessage, serverChatMessage);
  handleSyncLobby(socket);
};

// source of truth is the admin
export const handleUpdateLobby = (socket: Socket, payload: Lobby) => {
  const roomCode = getRoomCode(socket);

  activeRooms.set(roomCode, payload);
  io.to(roomCode).emit(ServerAction.SyncLobby, payload);
};
