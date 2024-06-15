import { Socket } from "socket.io-client";
import { Client, ClientPayload } from "../clientContext";
import { ClientAction, LoginRequest } from "../../lib/types";

export function clientReducer(state: Client, payload: ClientPayload) {
  switch (payload.action) {
    case ClientAction.ChangeSocket:
      return handleChangeSocket(state, payload);
    case ClientAction.ChangeRoomCode:
      return handleChangeRoomCode(state, payload);
    case ClientAction.ChangeNickname:
      return handleChangeNickname(state, payload);
    case ClientAction.JoinRoom:
      return handleJoinRoom(state, payload);
    default:
      throw Error("Unknown ClientAction");
  }
}

const handleChangeSocket = (state: Client, payload: ClientPayload) => {
  if (payload.payload instanceof Socket == false) {
    throw Error("Invalid arguments");
  }

  const newClient: Client = {
    ...state,
    socket: payload.payload,
  };

  return newClient;
};

const handleChangeNickname = (state: Client, payload: ClientPayload) => {
  if (typeof payload.payload !== "string") {
    throw Error("Invalid arguments");
  }

  const newClient: Client = {
    ...state,
    nickname: payload.payload,
  };

  return newClient;
};

function handleChangeRoomCode(state: Client, payload: ClientPayload) {
  if (typeof payload.payload !== "string") {
    throw Error("Invalid arguments");
  }

  const newClient: Client = {
    ...state,
    roomCode: payload.payload,
  };

  return newClient;
}

function handleJoinRoom(state: Client, payload: ClientPayload) {
  const { nickname, roomCode } = payload.payload as LoginRequest;

  if (typeof nickname !== "string") throw Error("Invalid nickame");
  if (typeof roomCode !== "string") throw Error("Invalid roomcode");

  const newClient: Client = {
    ...state,
    roomCode: roomCode,
    nickname: nickname,
  };

  return newClient;
}
