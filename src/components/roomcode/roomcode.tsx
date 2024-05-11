import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "react-toastify";
import RoomCodeToast from "../toasts/roomcodeToast";

export default function RoomCode(props: { code: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(props.code);
    toast(<RoomCodeToast />, {
      hideProgressBar: true,
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col flex-nowrap items-center justify-center gap-2 rounded-md bg-slate-700 p-2">
      <div className="select-none font-bold">Room Code</div>
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-md p-1 hover:bg-slate-500">
          <div
            className="cursor-pointer hover:text-yellow-100"
            onClick={handleCopy}
          >
            <ContentCopy />
          </div>
        </div>
        <div className="select-all rounded-md bg-slate-800 px-2 py-1 font-mono">
          {isVisible ? props.code : "••••••"}
        </div>
        <div className="flex items-center justify-center rounded-md p-1 hover:bg-slate-500">
          <div
            className="cursor-pointer hover:text-yellow-100"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <Visibility /> : <VisibilityOff />}
          </div>
        </div>
      </div>
    </div>
  );
}
