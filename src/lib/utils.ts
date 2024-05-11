import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 6);

export const generateRoomCode = () => nanoid();
