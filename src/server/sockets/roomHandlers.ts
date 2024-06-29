import { Socket } from "socket.io";
import {
  ChatMessage,
  Lobby,
  Player,
  LoginRequest,
  ServerAction,
} from "../../lib/types";
import { activeRooms, io } from "../server";
import { handleUserJoined } from "./lobbyHandlers";
import { defaultRoom } from "../../lib/constants";
import { copyOf } from "../../lib/utils";

export const handleJoinRoom = (socket: Socket, payload: LoginRequest) => {
  if (!payload.roomCode && !payload.nickname) {
    throw Error("Invalid arguments");
  }

  const lobby: Lobby | undefined = activeRooms.get(payload.roomCode);

  if (!lobby) {
    throw Error(`room with code ${payload.roomCode} does not exist`);
  }

  const playerExists =
    lobby.players.find(
      (player: Player) => player.nickname == payload.nickname,
    ) != null;

  if (playerExists) {
    throw Error("Nickname already in use");
  }

  const newPlayer: Player = {
    socketId: socket.id,
    nickname: payload.nickname,
    isReady: false,
  };

  if (!lobby.admin) {
    lobby.admin = socket.id;
  }

  lobby.players.push(newPlayer);

  socket.join(payload.roomCode);
  handleUserJoined(socket, payload);
};

export const handleCreateRoom = (_socket: Socket, payload: LoginRequest) => {
  if (activeRooms.has(payload.roomCode)) throw Error("Room already exists");

  const newRoom: Lobby = copyOf(defaultRoom);
  activeRooms.set(payload.roomCode, newRoom);
};

export const handleChatMessage = (payload: ChatMessage) => {
  io.to(payload.room).emit(ServerAction.ChatMessage, payload);
};
