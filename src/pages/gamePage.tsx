import Dealer from "../components/game/dealer";
import { GameProvider } from "../context/gameContext";
import { useLobby } from "../context/lobbyContext";
import { GameState } from "../lib/types";
import SetupPage from "./setupPage";

export default function GamePage() {
  // const client = useClient()
  const lobby = useLobby();

  // prettier-ignore
  return (
    <>
      {lobby.state === GameState.Running ? (
        <GameProvider>
          <Dealer />
        </GameProvider>
      ) : (
        <SetupPage />
      )}
    </>
  );
}
