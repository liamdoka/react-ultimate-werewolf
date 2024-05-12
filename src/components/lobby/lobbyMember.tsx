import { Stars } from "@mui/icons-material";

export default function LobbyMember(props: {
  nickname: string;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex flex-grow basis-1/3 flex-row flex-nowrap items-center rounded-md bg-slate-800 p-2">
      {props.isAdmin && (
        <div>
          <Stars />
        </div>
      )}
      <div className="px-2 font-bold">{props.nickname}</div>
    </div>
  );
}
