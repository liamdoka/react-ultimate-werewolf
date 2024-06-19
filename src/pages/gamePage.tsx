import { useLobby } from "../context/lobbyContext";
import { GameState } from "../lib/types";
import SetupPage from "./setupPage";

export default function GamePage() {
  // const client = useClient()
  const lobby = useLobby();

  return (
    <>
      {lobby.state === GameState.Running ? (
        <div> the game has started,,, technically </div>
      ) : (
        <SetupPage />
      )}
    </>
  );
}
