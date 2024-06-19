import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify";
import LoginPage from "./pages/loginPage";
import GamePage from "./pages/gamePage";
import { useClient } from "./context/clientContext";
import { LobbyProvider } from "./context/lobbyContext";

function App() {
  const client = useClient();
  const isLoggedIn = client.nickname != "" && client.roomCode != "";

  return (
    <div className="m-0 flex min-h-full min-w-full flex-col items-center justify-center bg-slate-800 p-0 text-slate-50">
      <main className="m-auto flex h-screen w-full max-w-screen-lg flex-col items-center justify-evenly">
        {isLoggedIn ? (
          <LobbyProvider>
            <GamePage />
          </LobbyProvider>
        ) : (
          <LoginPage />
        )}
        <ToastContainer
          position="bottom-left"
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
