import { allCards } from "../../lib/allCards";
import { CardDetails, CardType } from "../../lib/types";

export default function GameCard(props: {
  toggleEnabled: Function;
  cardType: CardType;
  enabled?: boolean;
}) {
  const cardDetails: CardDetails = allCards[props.cardType];
  const isDisabled = props.enabled ? "" : "opacity-30";

  return (
    <div
      onMouseDown={() => props.toggleEnabled()}
      className={`flex flex-col gap-1 rounded-md bg-slate-700 p-1 shadow-md ${isDisabled} cursor-pointer`}
    >
      <div className="w-24 overflow-clip rounded-sm">
        <img
          className="bg-cover"
          draggable={false}
          src={`/cards/${cardDetails.img}`}
          alt={cardDetails.name}
        />
      </div>
      <p className="text-center font-bold">{cardDetails.name}</p>
    </div>
  );
}
