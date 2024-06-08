import { Done, Stars } from "@mui/icons-material";

export default function LobbyMember(props: {
  nickname: string;
  isReady: boolean;
  isAdmin: boolean;
}) {
  const bgColor = props.isReady ? " bg-emerald-800" : "bg-slate-800";

  return (
    <div
      className={`${bgColor} flex flex-grow basis-1/3 flex-row flex-nowrap items-center rounded-md p-2`}
    >
      {props.isAdmin && (
        <div>
          <Stars />
        </div>
      )}
      <div className="px-2 font-bold">{props.nickname}</div>
      <div className="flex-grow"></div>
      <div>{props.isReady && <Done />}</div>
    </div>
  );
}
