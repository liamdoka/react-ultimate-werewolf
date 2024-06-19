import { customAlphabet } from "nanoid";
import { useEffect, useRef } from "react";
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

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
