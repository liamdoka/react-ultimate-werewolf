import { Socket } from "socket.io";
import {
  ChatMessage,
  GameState,
  RoomObject,
  RoomRequest,
  ServerAction,
  StatusCallback,
} from "../../lib/types";
import { activeRooms } from "../server";

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

  const response: StatusCallback = {
    status: "success",
  };

  socket.emit(ServerAction.JoinRoomCallback, response);
};

export const handleCreateRoom = (socket: Socket, payload: RoomRequest) => {
  console.log(activeRooms[payload.roomCode]);

  if (activeRooms[payload.roomCode]) {
    return;
  }

  const newRoom: RoomObject = {
    players: [],
    state: GameState.Waiting,
  };

  activeRooms[payload.roomCode] = newRoom;
  socket.join(payload.roomCode);

  console.log(activeRooms);
};

export const handleChatMessage = (socket: Socket, payload: ChatMessage) => {
  console.log(`server receieved message: ${payload.message}`);

  // socket.to(payload.room).emit(ServerAction.ChatMessage, payload);

  socket.emit(ServerAction.ChatMessage, payload);
  console.log(socket.rooms);

  console.log(activeRooms);
};
