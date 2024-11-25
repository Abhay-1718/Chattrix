import { Server } from "socket.io";
import Message from "./models/MessagesModel.js";

const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map(); // Keeps track of socket ids for each user

  // Function to handle disconnections
  const disconnect = (socket) => {
  
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  // Function to handle sending a message
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);



    try {
      // Create the message in the database
      const createdMessage = await Message.create(message);

      // Populate sender and recipient fields to send complete message data
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image")
        .populate("recipient", "id email firstName lastName image");


      // Emit the message to the recipient and sender (for both users)
      if (recipientSocketId) {
        
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }

      if (senderSocketId) {
        
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (err) {
      console.error("Error in sendMessage:", err);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id); // Store user socket id
      
    } else {
      console.log("UserId not provided during connection.");
    }

    // Listen for sendMessage event
    socket.on("sendMessage", sendMessage);

    // Handle disconnect
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setUpSocket;
