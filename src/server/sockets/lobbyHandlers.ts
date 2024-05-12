import { Socket } from "socket.io";
import { ChatMessage, Lobby, RoomRequest, ServerAction } from "../../lib/types";
import { getRoomCode } from "../../lib/utils";
import { activeRooms } from "../server";

export const handleUpdateLobby = (socket: Socket) => {
  const roomCode = getRoomCode(socket);
  const lobby = activeRooms[roomCode];

  socket.to(roomCode).emit(ServerAction.UpdateLobby, lobby);
  socket.emit(ServerAction.UpdateLobby, lobby);
};

export const handleUserJoined = (
  socket: Socket,
  payload: Lobby & RoomRequest,
) => {
  const roomCode = getRoomCode(socket);

  const serverChatMessage: ChatMessage = {
    sender: "",
    room: roomCode,
    message: `${payload.nickname} joined the lobby`,
    iat: Date.now(),
  };

  socket.to(roomCode).emit(ServerAction.ChatMessage, serverChatMessage);
  handleUpdateLobby(socket);
};

export const handleUserDisconnected = (
  socket: Socket,
  payload: Lobby & RoomRequest,
) => {
  const roomCode = getRoomCode(socket);

  const serverChatMessage: ChatMessage = {
    sender: "",
    room: roomCode,
    message: `${payload.nickname} left the lobby`,
    iat: Date.now(),
  };

  socket.to(roomCode).emit(ServerAction.ChatMessage, serverChatMessage);
  handleUpdateLobby(socket);
};
