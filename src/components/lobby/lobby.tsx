import { useEffect, useState } from "react";
import LobbyMember from "./lobbyMember";
import { Socket } from "socket.io-client";
import { GameState, Lobby, ServerAction } from "../../lib/types";

export default function LobbyMenu(props: { socket: Socket }) {
  const [lobby, setLobby] = useState<Lobby>({
    players: [],
    state: GameState.Waiting,
  });

  useEffect(() => {
    props.socket.on(ServerAction.UpdateLobby, handleUpdateLobby);
    props.socket.emit(ServerAction.UpdateLobby);

    return () => {
      props.socket.off(ServerAction.UpdateLobby);
    };
  });

  const handleUpdateLobby = (payload: Lobby) => {
    setLobby(payload);
  };

  return (
    <div className="flex w-full min-w-96 max-w-96 flex-col flex-nowrap items-stretch justify-center gap-2 rounded-md bg-slate-700 p-2 shadow-xl">
      <p className="text-center font-bold">Lobby</p>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        {lobby.players.map((nickname, i) => (
          <LobbyMember nickname={nickname} key={nickname} isAdmin={i === 0} />
        ))}
      </div>
    </div>
  );
}
