import { Lobby, LobbyAction, Player } from "../../lib/types";
import { copyOf } from "../../lib/utils";
import { LobbyPayload } from "../lobbyContext";

export function lobbyReducer(state: Lobby, payload: LobbyPayload) {
  switch (payload.action) {
    case LobbyAction.UpdateIsReady:
      return handleUpdateIsReady(state, payload);
    case LobbyAction.SyncLobby:
      return handleSyncLobby(state, payload);
    default:
      return state;
  }
}

const handleUpdateIsReady = (state: Lobby, payload: LobbyPayload) => {
  const index = state.players.findIndex(
    (player: Player) => player.socketId == payload.socketId,
  );

  if (index === -1) return state;

  const newPlayers = copyOf(state.players);
  newPlayers[index].isReady = !newPlayers[index].isReady;

  const newState: Lobby = {
    ...state,
    players: newPlayers,
  };

  return newState;
};

const handleSyncLobby = (_state: Lobby, payload: LobbyPayload) => {
  return payload.payload;
};
