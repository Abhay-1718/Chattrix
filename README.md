# MERN Chat App

This is a full-stack chat application built with the MERN stack (MongoDB, Express, React, Node.js). The app allows users to connect in real-time through a chat interface, leveraging technologies like **Socket.IO**, **JWT authentication**, and **MongoDB** for storing user data.

## Features

- **Real-time Messaging:** Powered by Socket.IO, enabling real-time chat updates.
- **User Authentication:** Secure login and registration using **JWT** tokens and password encryption.
- **File Uploads:** Users can upload images and other files during chat.
- **Emoji Picker:** Integration of an emoji picker for enhanced messaging.
- **Modern UI:** The frontend is styled using **Tailwind CSS** with Material UI components for a smooth, responsive experience.

## Architecture

- **Backend (Node.js + Express):** Handles authentication, user data management, and serves as the communication hub for the Socket.IO connection.
- **Frontend (React + Vite):** Provides the user interface, handles interactions, and communicates with the backend via API calls and WebSockets.

## Installation

To get started, you'll need to clone the project and set up both the **frontend** and **backend**.

### Backend Setup

1. Clone the repository or navigate to the backend directory.
   
   ```bash
   git clone <repository-url> backend
   cd backend

2.  Install the required dependencies.
   npm install

3. Set up environment variables: Create a .env file in the backend folder and add the following variables:
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key


4. Run the development server:
   npm run dev

 The backend will start on http://localhost:5000.


Frontend Setup
1. Clone the repository or navigate to the frontend directory.
   git clone <repository-url> frontend
  cd frontend

2. Install the required dependencies. npm install

3. Run the frontend development server: npm run dev



Technologies Used
Backend:

Node.js
Express.js
MongoDB (via Mongoose)
JWT Authentication
Socket.IO
Bcrypt for password hashing
Multer for file uploads
CORS for handling cross-origin requests
Frontend:

React
Vite (for fast builds and hot-reloading)
Tailwind CSS (for styling)
Socket.IO-Client (for real-time communication)
React Router (for navigation)
React Toastify (for notifications)
Zustand (for state management)
