"use client";
import { Send } from "@mui/icons-material";
import { Message } from "../../../server/lib/types";

const socket = new WebSocket("ws://localhost:3000/chat");
let allMessages: string[] = [];
socket.addEventListener("message", (event) => {
  console.log(event);
});

export default function Chatbox() {
  const handleKeyDown = (e: any) => {
    if (e?.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = () => {
    const message = (
      document.getElementById("chatboxInput") as HTMLInputElement
    )?.value;
    if (message) {
      sendMessage(message);
    }
  };

  const sendMessage = (message: string) => {
    const messageObject: Message = {
      type: "CHAT",
      payload: message,
    };

    socket.send(JSON.stringify(messageObject));
  };

  return (
    <div className="flex min-h-96 min-w-96 flex-col items-center justify-between rounded-lg bg-slate-700 p-4 shadow-xl">
      <p className="pb-2 text-center font-bold">Chat</p>
      <div className="flex w-full flex-grow flex-col justify-between overflow-hidden rounded-md bg-slate-800">
        <div className="flex flex-grow flex-col overflow-y-auto p-2">
          {allMessages.length == 0 ? (
            <p className="pt-8 text-center text-slate-500">Message Area</p>
          ) : (
            allMessages.map((message, i) => <div key={i}>{message}</div>)
          )}
        </div>
        <div className="flex flex-row flex-nowrap justify-between border-t-2 border-slate-700 text-slate-50">
          <input
            onKeyDown={(event) => handleKeyDown(event)}
            className="flex-grow bg-transparent px-4 py-1 focus:outline-none"
            id="chatboxInput"
            type="text"
            placeholder="write a message"
          />
          <div className="cursor-pointer p-2" onClick={handleSend}>
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}
