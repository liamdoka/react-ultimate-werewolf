"use client";
import { Send } from "@mui/icons-material";
import { ChatMessage, ServerAction } from "../../lib/types";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import ChatboxMessage from "./chatboxMessage";

export default function Chatbox(props: {
  socket: Socket;
  nickname: string;
  roomCode: string;
}) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    props.socket.on(ServerAction.ChatMessage, handleChatMessage);

    // cleanup function so that it doesnt render twice
    return () => {
      props.socket.off(ServerAction.ChatMessage);
    };
  }, [props.socket]);

  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  const scrollChat = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop =
        chatboxRef.current.scrollHeight - chatboxRef.current.clientHeight;
    }
  };

  const handleKeyDown = (e: any) => {
    if (e?.key === "Enter") {
      handleSend();
    }
  };

  const handleChatMessage = (payload: ChatMessage) => {
    setChatMessages((prev) => [...prev, payload]);
  };

  const handleSend = () => {
    const message = inputRef.current?.value;
    if (message) {
      sendMessage(message);
      inputRef.current.value = "";
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
  };

  return (
    <div className="flex max-h-96 min-h-96 min-w-96 max-w-96 flex-col items-stretch gap-2 rounded-lg bg-slate-700 p-2 shadow-xl">
      <p className="text-center font-bold">Chat</p>
      <div className="flex flex-grow flex-col justify-between overflow-hidden  rounded-md bg-slate-800">
        <div className=" flex h-full flex-grow flex-col justify-end overflow-hidden">
          <div
            className="flex max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-4"
            ref={chatboxRef}
          >
            {chatMessages.length == 0 ? (
              <p className="text-center text-slate-500"></p>
            ) : (
              chatMessages.map((message: ChatMessage) =>
                message.sender == "" ? (
                  <p
                    className="text-center text-sm text-slate-500"
                    key={message.iat}
                  >
                    {message.message}
                  </p>
                ) : (
                  <ChatboxMessage
                    key={message.iat}
                    self={message.sender == props.nickname}
                    {...message}
                  />
                ),
              )
            )}
          </div>
        </div>
        <div className="flex flex-row flex-nowrap justify-between border-t-2 border-slate-700 text-slate-50">
          <input
            onKeyDown={(event) => handleKeyDown(event)}
            className="flex-grow bg-transparent px-4 py-1 focus:outline-none"
            ref={inputRef}
            type="text"
            placeholder="Aa..."
          />
          <div className="cursor-pointer p-2" onClick={handleSend}>
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}
