type ChatMessageProps = {
  timestamp?: string;
  author?: string;
  message: string;
};

export default function ChatboxMessage(props) {
  return (
    <div className="flex flex-col">
      <div className="px-2 text-sm text-slate-400">
        {props.author} - {props.timestamp}
      </div>
      <div>{props.message}</div>
    </div>
  );
}
