import { customAlphabet } from "nanoid";
import { Socket } from "socket.io";

const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 6);

export const generateRoomCode = () => nanoid();

// assumes only one room, which should be true
export const getRoomCode = (socket: Socket) => {
  const code = [...socket.rooms][1];
  return code ?? "";
};
