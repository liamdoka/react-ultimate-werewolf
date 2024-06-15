import { createContext, useContext, useReducer } from "react";
import { Lobby, LobbyAction } from "../lib/types";
import { copyOf } from "../lib/utils";
import { defaultRoom } from "../lib/constants";
import { lobbyReducer } from "./reducers/lobbyReducer";

export type LobbyPayload = {
  action: LobbyAction;
  socketId: string;
  payload: any;
};

const LobbyContext = createContext<Lobby>(copyOf(defaultRoom));
const LobbyDispatchContext = createContext<React.Dispatch<LobbyPayload>>(
  () => {},
);

export function LobbyProvider({ children }: any) {
  const [lobby, dispatch] = useReducer(lobbyReducer, copyOf(defaultRoom));

  return (
    <LobbyContext.Provider value={lobby}>
      <LobbyDispatchContext.Provider value={dispatch}>
        {children}
      </LobbyDispatchContext.Provider>
    </LobbyContext.Provider>
  );
}

export function useLobby() {
  return useContext(LobbyContext);
}

export function useLobbyDispatch() {
  return useContext(LobbyDispatchContext);
}
