import { allCards } from "../../lib/allCards";
import { CardDetails, CardType } from "../../lib/types";

export default function SetupCard(props: {
  cardType: CardType;
  enabled?: boolean;
  toggleEnabled: Function;
  selectable?: boolean;
}) {
  const cardDetails: CardDetails = allCards[props.cardType];
  const isDisabled = !props.enabled ? "opacity-30" : "";
  const isSelectable = props.selectable ? "cursor-pointer" : "";

  return (
    <div
      onMouseDown={() => props.toggleEnabled()}
      className={`flex select-none flex-col gap-1 rounded-md bg-slate-700 p-1 shadow-md ${isDisabled} ${isSelectable} transition-opacity`}
    >
      <div className="w-16 overflow-clip rounded-md md:w-24 md:rounded-sm">
        <img
          className="bg-cover"
          draggable={false}
          src={`/cards/${cardDetails.img}`}
          alt={cardDetails.name}
        />
      </div>
      <p className="text-center text-xs font-bold md:text-base">
        {cardDetails.name}
      </p>
    </div>
  );
}
