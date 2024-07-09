import { CardDetails, CardType, GameAction } from "./types";

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
    utility:
      "If there is only one BLU SPY, look at a card from the middle.\nIf there are two, do nothing.",
    action: GameAction.CheckRiverSingle,
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
    action: GameAction.SwapWithPlayer,
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
    action: GameAction.CheckCard,
  },
  [CardType.Pyro]: {
    name: "Pyro",
    img: "pyro.png",
    details: "",
    utility: "",
    action: GameAction.SwapOtherPlayers,
  },
  [CardType.Scout]: {
    name: "Scout",
    img: "scout.png",
    details: "",
    utility: "",
    action: GameAction.CheckOneOrTwo,
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
    action: GameAction.AssumeForm,
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
