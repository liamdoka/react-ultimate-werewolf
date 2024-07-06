import { customAlphabet } from "nanoid";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io";
import { CardType } from "./types";

const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 6);

export const generateRoomCode = () => nanoid();

// assumes only one room, which should be true but should probably refactor
export const getRoomCode = (socket: Socket) => {
  const code = [...socket.rooms][1];
  return code ?? "";
};

export function copyOf<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}

export function shuffled<T>(array: T[]): T[] {
  let currentIndex: number = array.length;
  const newArray = copyOf(array);

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

export function createPlayerTurns(cards: Map<string, number>): string[][] {
  const cardSet = new Map<number, string[]>();

  for (const [id, type] of cards.entries()) {
    const entries = cardSet.get(type);

    if (entries == null) {
      const newArray = [id];
      cardSet.set(type, newArray);
    } else {
      entries.push(id);
      cardSet.set(type, entries);
    }
  }
  const turns: string[][] = [];
  const bluSpy = cardSet.get(CardType.BluSpy) ?? [];

  // prettier-ignore
  turns.concat(
    cardSet.get(CardType.Spy) ?? [],
    bluSpy.length > 1 ? [] : bluSpy,
    cardSet.get(CardType.Scout) ?? [],
    cardSet.get(CardType.Pyro) ?? [],
    cardSet.get(CardType.Engineer) ?? [],
    cardSet.get(CardType.Demoman) ?? [],
    cardSet.get(CardType.Medic) ?? [],
  ).filter((arr) => arr.length > 0)

  return turns;
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

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }
    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);
}
