import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClientProvider } from "./context/clientContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClientProvider>
      <App />
    </ClientProvider>
  </React.StrictMode>,
);
