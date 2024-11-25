import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setUpSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";

dotenv.config();  

const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(express.json());
const corsOptions = {
  origin: process.env.ORIGIN || 'http://localhost:5173',  // Use ORIGIN from env, with fallback
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
app.use(cors(corsOptions));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));






app.use(cookieParser())


//routes
app.use("/api/auth" , authRoutes)
app.use("/api/contacts", contactRoutes)
app.use('/api/messages', messagesRoutes)

// Database connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err.message));

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setUpSocket(server)

app.get("/", (req, res) => {
    res.send("API working");
  });
  
