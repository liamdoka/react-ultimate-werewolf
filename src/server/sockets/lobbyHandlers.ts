import { Socket } from "socket.io";
import { ChatMessage, Lobby, RoomRequest, ServerAction } from "../../lib/types";
import { getRoomCode } from "../../lib/utils";

export const handleUpdateLobby = (socket: Socket, payload: Lobby) => {
  const roomCode = getRoomCode(socket);

  socket.to(roomCode).emit(ServerAction.UpdateLobby, payload);
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
  socket.to(roomCode).emit(ServerAction.UpdateLobby, payload);
};
