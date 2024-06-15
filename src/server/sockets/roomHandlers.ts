import { Socket } from "socket.io";
import {
  CardType,
  ChatMessage,
  Lobby,
  Player,
  LoginRequest,
  ServerAction,
  StatusCallback,
} from "../../lib/types";
import { activeRooms } from "../server";
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
    card: CardType.Empty,
    isReady: false,
  };

  if (!lobby.admin) {
    lobby.admin = socket.id;
  }

  lobby.players.push(newPlayer);

  socket.join(payload.roomCode);

  const response: StatusCallback & LoginRequest = {
    status: "success",
    nickname: payload.nickname,
    roomCode: payload.roomCode,
  };

  socket.emit(ServerAction.JoinRoomCallback, response);
  handleUserJoined(socket, { ...payload, ...lobby });
};

export const handleCreateRoom = (_socket: Socket, payload: LoginRequest) => {
  if (activeRooms.has(payload.roomCode)) {
    throw Error("Room already exists");
  }

  const newRoom: Lobby = copyOf(defaultRoom);
  activeRooms.set(payload.roomCode, newRoom);
};

export const handleChatMessage = (socket: Socket, payload: ChatMessage) => {
  //console.log(`server receieved message: ${payload.message}`);

  socket.to(payload.room).emit(ServerAction.ChatMessage, payload);
  socket.emit(ServerAction.ChatMessage, payload);
};
