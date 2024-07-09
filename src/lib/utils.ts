import { customAlphabet } from "nanoid";
import { Socket } from "socket.io";
import { CardType, Lobby } from "./types";

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
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

export const allPlayersReady = (_lobby: Lobby): boolean => {
  for (const player of _lobby.players) {
    if (player.isReady == false) return false;
  }
  return true;
};

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
