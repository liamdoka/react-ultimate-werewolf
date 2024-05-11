import { useState } from "react";

import { io } from "socket.io-client";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/loginPage";
import GamePage from "./pages/gamePage";

const socket = io("ws://localhost:3000");

function App() {
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div className="m-0 flex min-h-full min-w-full flex-col items-center justify-center bg-slate-800 p-0 text-slate-50">
      <main className="m-auto flex h-screen w-full max-w-screen-lg flex-col items-center justify-evenly">
        {isLoggedIn ? (
          <GamePage nickname={nickname} roomCode={roomCode} socket={socket} />
        ) : (
          <LoginPage
            socket={socket}
            setLoggedIn={setLoggedIn}
            setNickname={setNickname}
            setRoomCode={setRoomCode}
          />
        )}
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
