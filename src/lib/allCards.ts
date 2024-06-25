import { CardDetails, CardType } from "./types";

export const allCards: Record<CardType, CardDetails> = {
  [CardType.Empty]: {
    name: "Empty",
    img: "back.png",
    details: "",
    utility: "",
  },
  [CardType.BluSpy]: {
    name: "Blu Spy",
    img: "blu_spy.png",
    details: "",
    utility: "",
  },
  [CardType.Demoman]: {
    name: "Demoman",
    img: "demoman.png",
    details: "",
    utility: "",
  },
  [CardType.Engineer]: {
    name: "Engineer",
    img: "engineer.png",
    details: "",
    utility: "",
  },
  [CardType.Heavy]: {
    name: "Heavy",
    img: "heavy.png",
    details: "",
    utility: "",
  },
  [CardType.Medic]: {
    name: "Medic",
    img: "medic.png",
    details: "",
    utility: "",
  },
  [CardType.Pyro]: {
    name: "Pyro",
    img: "pyro.png",
    details: "",
    utility: "",
  },
  [CardType.Scout]: {
    name: "Scout",
    img: "scout.png",
    details: "",
    utility: "",
  },
  [CardType.Sniper]: {
    name: "Sniper",
    img: "sniper.png",
    details: "",
    utility: "",
  },
  [CardType.Soldier]: {
    name: "Soldier",
    img: "soldier.png",
    details: "",
    utility: "",
  },
  [CardType.Spy]: {
    name: "Spy",
    img: "spy.png",
    details: "",
    utility: "",
  },
};

export const defaultDeck: CardType[] = [
  CardType.BluSpy,
  CardType.BluSpy,
  CardType.BluSpy,
  CardType.Soldier,
  CardType.Soldier,
  CardType.Soldier,
  CardType.Scout,
  CardType.Pyro,
  CardType.Engineer,
  CardType.Demoman,
  CardType.Medic,
  CardType.Medic,
  CardType.Sniper,
  CardType.Heavy,
  CardType.Spy,
];
