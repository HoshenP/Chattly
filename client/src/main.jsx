import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./socket/socket";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <App />
    <Toaster closeButton />
  </SocketProvider>
);
