import { Socket } from "socket.io-client";
import Login from "../components/login/login";

export default function LoginPage(props: {
  socket: Socket;
  setLoggedIn: Function;
  setRoomCode: Function;
}) {
  // TODO: Refactor this to use context and reducer!

  return (
    <div className="flex flex-col items-center gap-8">
      <b className="text-center text-6xl">
        Ultimate<i>Werewolf</i>
      </b>
      <Login
        socket={props.socket}
        setLoggedIn={props.setLoggedIn}
        setRoomCode={props.setRoomCode}
      />
    </div>
  );
}
