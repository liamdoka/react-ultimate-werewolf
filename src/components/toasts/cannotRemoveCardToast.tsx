import { Info } from "@mui/icons-material";

export default function CannotRemoveCardToast() {
  return (
    <div className="flex flex-row items-center justify-center gap-2 p-2">
      <div>
        <Info />
      </div>
      <div>Must have at lease one BLU Spy in the deck</div>
    </div>
  );
}
