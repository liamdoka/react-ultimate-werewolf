import { Socket } from "socket.io";
import {
  ChatMessage,
  GameState,
  Lobby,
  RoomRequest,
  ServerAction,
  StatusCallback,
} from "../../lib/types";
import { activeRooms } from "../server";
import { handleUserJoined } from "./lobbyHandlers";

export const handleJoinRoom = (socket: Socket, payload: RoomRequest) => {
  if (!payload.roomCode && !payload.nickname) {
    throw Error("Invalid arguments");
  }

  if (!activeRooms[payload.roomCode]) {
    throw Error("Room code does not exist");
  }

  if (activeRooms[payload.roomCode].players.includes(payload.nickname)) {
    throw Error("Nickname already in use");
  }

  activeRooms[payload.roomCode].players.push(payload.nickname);
  socket.join(payload.roomCode);

  const response: StatusCallback & RoomRequest = {
    status: "success",
    nickname: payload.nickname,
    roomCode: payload.roomCode,
  };

  socket.emit(ServerAction.JoinRoomCallback, response);
  handleUserJoined(socket, { ...payload, ...activeRooms[payload.roomCode] });
};

export const handleCreateRoom = (_socket: Socket, payload: RoomRequest) => {
  if (activeRooms[payload.roomCode]) {
    throw Error("Room already exists");
  }

  const newRoom: Lobby = {
    players: [],
    state: GameState.Waiting,
  };

  activeRooms[payload.roomCode] = newRoom;
};

export const handleChatMessage = (socket: Socket, payload: ChatMessage) => {
  console.log(`server receieved message: ${payload.message}`);

  socket.to(payload.room).emit(ServerAction.ChatMessage, payload);
  socket.emit(ServerAction.ChatMessage, payload);
};
