import { customAlphabet } from "nanoid";
import { Socket } from "socket.io";

const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 6);

export const generateRoomCode = () => nanoid();

// assumes only one room, which should be true but should probably refactor
export const getRoomCode = (socket: Socket) => {
  const code = [...socket.rooms][1];
  return code ?? "";
};

export function copyOf<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
