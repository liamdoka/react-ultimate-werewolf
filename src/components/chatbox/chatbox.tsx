"use client";
import { Send } from "@mui/icons-material";
import { ChatMessage, ServerAction } from "../../lib/types";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const handleChatMessage = (payload: ChatMessage) => {
  console.log(`client received message: ${payload.message}`);
  allMessages.push(payload.message);
};

let allMessages: string[] = [];

export default function Chatbox(props: {
  socket: Socket;
  nickname: string;
  roomCode: string;
}) {
  useEffect(() => {
    props.socket.on(ServerAction.ChatMessage, handleChatMessage);
  });

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages]);

  const handleKeyDown = (e: any) => {
    if (e?.key === "Enter") {
      handleSend();
    }
  };

  const handleSend = () => {
    const input = document.getElementById("chatboxInput") as HTMLInputElement;
    const message = input?.value;
    if (message) {
      sendMessage(message);
      input.value = "";
    }
  };

  const sendMessage = (message: string) => {
    const messageObject: ChatMessage = {
      message: message,
      sender: props.nickname,
      room: props.roomCode,
      iat: Date.now(),
    };

    props.socket.emit(ServerAction.ChatMessage, messageObject);
    console.log(`message sent in room ${props.roomCode}`);
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
