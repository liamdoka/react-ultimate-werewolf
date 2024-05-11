import { ChatMessage } from "../../lib/types";

export default function ChatboxMessage(
  props: ChatMessage & { self?: boolean },
) {
  const time = new Date(props.iat);
  const alignment = props.self ? "text-right" : "text-left";

  return (
    <div className={`flex flex-col ${alignment}`}>
      <p className="text-sm leading-3 text-slate-400">
        {props.self ? (
          <span>
            {time.toLocaleTimeString("en-US")} - <b>You</b>
          </span>
        ) : (
          <span>
            <b>{props.sender}</b> - {time.toLocaleTimeString("en-US")}
          </span>
        )}
      </p>
      <p>{props.message}</p>
    </div>
  );
}
