import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { HOST } from "../utils/constant";
import { useAppStore } from "../store";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      // Establish the socket connection with userId in the query string
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      // Handle socket connection error
      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // Handle socket disconnection
      socket.current.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        // Check if the received message is for the currently selected chat
        if (
          (selectedChatType !== undefined && selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          console.log("Adding message to store:", message);
          addMessage(message); // Add message to store
        }
      };

      // Listen for "recieveMessage" event
      socket.current.on("recieveMessage", handleRecieveMessage);

      // Clean up on component unmount
      return () => {
        socket.current.off("recieveMessage", handleRecieveMessage); // Remove listener
        socket.current.disconnect(); // Disconnect socket
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
