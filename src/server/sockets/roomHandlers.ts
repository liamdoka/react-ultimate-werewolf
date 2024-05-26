import { Socket } from "socket.io";
import {
  CardType,
  ChatMessage,
  GameState,
  Lobby,
  Player,
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

  const playerExists =
    activeRooms[payload.roomCode].players.find(
      (player: Player) => player.nickname == payload.nickname,
    ) != null;

  if (playerExists) {
    throw Error("Nickname already in use");
  }

  const newPlayer: Player = {
    socketId: socket.id,
    nickname: payload.nickname,
    card: CardType.Empty,
  };

  activeRooms[payload.roomCode].players.push(newPlayer);
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
    deck: [],
    state: GameState.Waiting,
    discussionTime: 0,
  };

  activeRooms[payload.roomCode] = newRoom;
};

export const handleChatMessage = (socket: Socket, payload: ChatMessage) => {
  console.log(`server receieved message: ${payload.message}`);

  socket.to(payload.room).emit(ServerAction.ChatMessage, payload);
  socket.emit(ServerAction.ChatMessage, payload);
};
