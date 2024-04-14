import { Message, type MessageType } from "./lib/types";

const activeRooms = {};

const server = Bun.serve<{ authToken: string }>({
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/chat") {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Websocket upgrade failed", { status: 500 });
    }
  },
  websocket: {
    async message(ws, message) {
      //console.log(`Received ${message}`);

      if (typeof message === "string") {
        try {
          const messageObject: Message = JSON.parse(message);
          console.log(handleMessage(messageObject));
        } catch (e) {
          console.error(e);
          console.log(`in message:\n ${message}`);
        }
      }
    },
  },
});

const handleMessage = ({ type, payload }: Message) => {
  switch (type) {
    case "CHAT":
      return handleChatMessage(payload);
    case "OTHER":
      return "something else";
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
};

const handleChatMessage = (payload: string) => {
  if (typeof payload !== "string") {
    throw new TypeError(`Expected string, received: ${typeof payload}`);
  }
  console.log(payload);
};
