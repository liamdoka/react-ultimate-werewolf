import { ServerWebSocket } from "bun";
import {
  Message,
  MessageType,
  UserObject,
  RoomObject,
  GameState,
  ChatMessage,
  WebSocketData,
} from "../lib/types";

const activeRooms: Record<string, RoomObject> = {};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
Bun.serve<WebSocketData>({
  port: 3000,
  hostname: "localhost",
  fetch(req, server) {
    const url = new URL(req.url);

    switch (url.pathname) {
      case "/ws":
        server.upgrade(req, {
          data: {
            createdAt: Date.now(),
            nickname: url.searchParams.get("nickname"),
            room: url.searchParams.get("room"),
          },
        });
        return undefined;
      case "/auth":
        const res = new Response("Yowzers");
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set(
          "Access-Control-Allow-Origin",
          "GET,POST,PUT,DELETE,OPTIONS",
        );
        console.log(req.body);
        console.log(req.headers);
        return res;
    }
    return new Response("Websocket upgrade failed", { status: 500 });
  },
  websocket: {
    async message(ws, message) {
      if (typeof message === "string") {
        try {
          const { type, payload }: Message = JSON.parse(message);
          handleMessage(type)(ws, payload);
        } catch (e) {
          console.error(e);
          console.log(`in message:\n ${message}`);
        }
      }
    },

    async open(ws) {
      console.log("Websocket connection opened");

      if (ws.data?.room !== null) {
        ws.subscribe(ws.data.room);
        ws.publish(ws.data.room, `${ws.data.nickname} joined the room`);
      }
    },

    async close(ws, code, reason) {
      console.log("Websocket connection closed");
    },
  },
});

const handleMessage = (type: MessageType): Function => {
  switch (type) {
    case MessageType.Chat:
      return handleChatMessage;
    case MessageType.Auth:
      return handleAuthMessage;
    case MessageType.Other:
      return handleOtherMessage;
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
};

const handleChatMessage = (ws: ServerWebSocket, payload: ChatMessage) => {
  // if (typeof payload !== "string") {
  //   throw new TypeError(`Expected string, received: ${typeof payload}`);
  // }
  ws.send(payload.message);
  //ws.publish(ws.data.room, payload.message);
};

const handleAuthMessage = (ws: ServerWebSocket, payload: UserObject) => {
  // check rooms
  console.log(payload);
  if (payload.room in activeRooms) {
    // add user to room
    const room: RoomObject = activeRooms[payload.room];
    room.players = [payload.nickname, ...room.players];

    activeRooms[payload.room] = { ...room };
  } else {
    // create new room
    const newRoom: RoomObject = {
      players: [payload.nickname],
      state: GameState.Waiting,
    };

    activeRooms[payload.room] = newRoom;
  }

  // emit some signal back to those in the room
  ws.publish(payload.room, `${payload.nickname} joined the room`);
};

const handleOtherMessage = (ws: ServerWebSocket, payload: string) => {
  console.log(payload);

  const welcomeMessage: Message = {
    type: MessageType.Chat,
    payload: "Welcome to the room!",
  };

  ws.send(JSON.stringify(welcomeMessage));
};
