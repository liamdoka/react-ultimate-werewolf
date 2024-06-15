import { Visibility, VisibilityOff, ContentCopy } from "@mui/icons-material";
import { easeInOut, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import RoomCodeCopiedToast from "../toasts/roomCodeCopiedToast";

export default function RoomCode(props: { code: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleCopy = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 300);

    navigator.clipboard.writeText(props.code);
    toast(<RoomCodeCopiedToast />, {
      hideProgressBar: true,
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col flex-nowrap items-center justify-center gap-2 rounded-md bg-slate-700 p-2 shadow-xl">
      <p className="select-none font-bold">Room Code</p>
      <div className="flex flex-row items-center justify-center gap-2">
        <div
          className="flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-slate-500 hover:text-yellow-100"
          onClick={handleCopy}
        >
          <motion.div
            animate={
              isTapped
                ? {
                    rotateZ: [0, 10, -10, 10, -10, 0],
                    transition: { duration: 0.3, ease: easeInOut },
                  }
                : {}
            }
          >
            <ContentCopy />
          </motion.div>
        </div>
        <div className="select-all rounded-md bg-slate-800 px-2 py-1 font-mono">
          {isVisible ? props.code : "••••••"}
        </div>
        <div
          className="flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-slate-500 hover:text-yellow-100"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <div>{isVisible ? <Visibility /> : <VisibilityOff />}</div>
        </div>
      </div>
    </div>
  );
}
