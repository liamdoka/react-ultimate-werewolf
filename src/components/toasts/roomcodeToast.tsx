import { ContentCopy } from "@mui/icons-material";

export default function RoomCodeToast() {
  return (
    <div className="flex flex-row items-center justify-center gap-2 p-2">
      <div>
        <ContentCopy />
      </div>
      <div>Room code copied to clipboard</div>
    </div>
  );
}
