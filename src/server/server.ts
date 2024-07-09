import { DisconnectReason, Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import {
  ChatMessage,
  Game,
  GameAction,
  Lobby,
  LoginRequest,
  OptNumber,
  OptString,
  Player,
  ServerAction,
} from "../lib/types";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleChatMessage,
} from "./sockets/roomHandlers";
import {
  handleSyncLobby,
  handleUpdateLobby,
  handleUserDisconnected,
} from "./sockets/lobbyHandlers";
import { getRoomCode } from "../lib/utils";
import {
  handleAssumeForm,
  handleCheckCard,
  handleCheckOneOrTwo,
  handleCheckRiverSingle,
  handleEndTurn,
  handleSetCard,
  handleStartGame,
  handleSwapOtherPlayers,
  handleSwapWithPlayer,
  handleSwapWithRiver,
} from "./sockets/gameHandlers";

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const activeRooms: Map<string, Lobby> = new Map();
export const activeGames: Map<string, Game> = new Map();

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // ROOM HANDLERS
  socket.on(ServerAction.CreateRoom, (payload: LoginRequest, callback) => {
    try {
      handleCreateRoom(socket, payload);
      callback(true);
    } catch (e) {
      console.error(e);
      callback(false);
    }
  });
  socket.on(ServerAction.JoinRoom, (payload: LoginRequest, callback) => {
    try {
      handleJoinRoom(socket, payload);
      callback(true);
    } catch (e) {
      console.error(e);
      callback(false);
    }
  });
  socket.on(ServerAction.ChatMessage, (payload: ChatMessage) =>
    handleChatMessage(payload),
  );

  // LOBBY HANDLERS
  socket.on(ServerAction.SyncLobby, () => handleSyncLobby(socket));
  socket.on(ServerAction.UpdateLobby, (payload: Lobby) =>
    handleUpdateLobby(socket, payload),
  );

  // GAME HANDLERS
  socket.on(ServerAction.StartGame, (payload: Lobby) =>
    handleStartGame(socket, payload),
  );
  socket.on(GameAction.SetCard, () => handleSetCard(socket));
  socket.on(GameAction.CheckCard, () => handleCheckCard(socket));
  socket.on(GameAction.CheckRiverSingle, (index: number) =>
    handleCheckRiverSingle(socket, index),
  );
  socket.on(
    GameAction.CheckOneOrTwo,
    (target: OptString, riverOne: OptNumber, riverTwo: OptNumber) =>
      handleCheckOneOrTwo(socket, target, riverOne, riverTwo),
  );
  socket.on(GameAction.SwapWithPlayer, (target: string) =>
    handleSwapWithPlayer(socket, target),
  );
  socket.on(GameAction.SwapWithRiver, (index: number) =>
    handleSwapWithRiver(socket, index),
  );
  socket.on(
    GameAction.SwapOtherPlayers,
    (targetOne: string, targetTwo: string) =>
      handleSwapOtherPlayers(socket, targetOne, targetTwo),
  );
  socket.on(GameAction.AssumeForm, (target: string) =>
    handleAssumeForm(socket, target),
  );
  socket.on(GameAction.EndTurn, () => handleEndTurn(socket));

  // Handle Disconnect with IO and Socket
  socket.on("disconnecting", (_: DisconnectReason) => {
    if (socket.rooms.size > 1) {
      const roomCode = getRoomCode(socket);
      const lobby = activeRooms.get(roomCode);
      if (!lobby) throw Error("Lobby does not exist");

      const currentPlayer = lobby.players.find(
        (player: Player) => player.socketId == socket.id,
      );

      lobby.players = lobby.players.filter(
        (player: Player) => player.socketId !== socket.id,
      );

      //update all lobbies
      if (lobby.players.length > 0) {
        lobby.admin = lobby.players[0].socketId;

        handleUserDisconnected(socket, {
          roomCode: roomCode,
          nickname: currentPlayer?.nickname ?? "",
        });
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
