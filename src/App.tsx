import { useEffect, useState } from "react";
import Chatbox from "./components/chatbox/chatbox";
import Login from "./components/login/login";

import { io } from "socket.io-client";
import RoomCode from "./components/roomcode/roomcode";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("ws://localhost:3000");

function App() {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div className="m-0 flex min-h-full min-w-full flex-col items-center justify-center bg-slate-800 p-0 text-slate-50">
      <main className="m-auto flex h-screen w-full max-w-screen-lg flex-col items-center justify-evenly">
        <div>
          {isLoggedIn ? (
            <div className="flex flex-col items-start gap-4">
              <RoomCode code={roomCode} />
              <Chatbox
                socket={socket}
                nickname={nickname}
                roomCode={roomCode}
              />
            </div>
          ) : (
            <Login
              socket={socket}
              setLoggedIn={setLoggedIn}
              setNickname={setNickname}
              setRoomCode={setRoomCode}
            />
          )}
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="dark"
          transition={Flip}
        />
      </main>
    </div>
  );
}

export default App;
