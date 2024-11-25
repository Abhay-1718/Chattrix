import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
  </ThemeProvider>
);
