import { createContext, useContext, useEffect, useReducer } from "react";
// import { socket } from "../socket";
import { clientReducer } from "./reducers/clientReducer";
import { ClientAction } from "../lib/types";
import { io, Socket } from "socket.io-client";

export interface Client {
  socket: Socket | null;
  nickname: string;
  roomCode: string;
}

export interface ClientPayload {
  action: ClientAction;
  payload: any;
}

const initialClient: Client = {
  socket: null,
  nickname: "",
  roomCode: "",
};

const ClientContext = createContext<Client>(initialClient);
const ClientDispatchContext = createContext<React.Dispatch<any>>(() => {});

export function ClientProvider({ children }: any) {
  const [client, dispatch] = useReducer(clientReducer, initialClient);

  useEffect(() => {
    const socket: Socket = io("ws://localhost:3000");

    dispatch({
      action: ClientAction.ChangeSocket,
      payload: socket,
    } satisfies ClientPayload);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ClientContext.Provider value={client}>
      <ClientDispatchContext.Provider value={dispatch}>
        {children}
      </ClientDispatchContext.Provider>
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}

export function useClientDispatch() {
  return useContext(ClientDispatchContext);
}
