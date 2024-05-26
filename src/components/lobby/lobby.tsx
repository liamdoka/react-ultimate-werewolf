import { Socket } from "socket.io-client";
import { Lobby } from "../../lib/types";
import LobbyMember from "./lobbyMember";

export default function LobbyMenu(props: { socket: Socket; lobby: Lobby }) {
  const playerNumString = `${props.lobby.players.length} / 10`;

  return (
    <div className="flex w-full min-w-96 max-w-96 flex-col flex-nowrap items-stretch justify-center gap-2 rounded-md bg-slate-700 p-2 shadow-xl">
      <div className="flex w-full flex-row flex-nowrap items-center justify-between px-2">
        <div className="select-none opacity-0">{playerNumString}</div>
        <div className="font-bold">Lobby</div>
        <div className="text-slate-400">{playerNumString}</div>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        {props.lobby.players.map((player, i) => (
          <LobbyMember
            nickname={player.nickname}
            key={player.nickname}
            isAdmin={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
