import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./auth/Auth";
import Chat from "./chat/Chat";
import Profile from "./profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "./store";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constant";

// PrivateRoute (No changes to styling or variable names)
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();

  // If userInfo is undefined or null, show loading until data is fetched
  if (userInfo === undefined) {
    return <div>Loading...</div>;
  }

  return !userInfo ? <Navigate to="/auth" /> : children;
};

// AuthRoute (No changes to styling or variable names)
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();

  // If userInfo is undefined or null, show loading until data is fetched
  if (userInfo === undefined) {
    return <div>Loading...</div>;
  }

  return userInfo ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch user info if it's already available
    if (userInfo !== undefined) {
      setLoading(false); // Stop loading if user info is available
      return;
    }

    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(null); // User is not logged in
        }
      } catch (error) {
        console.error(error);
        setUserInfo(null); // In case of error, set userInfo to null
      } finally {
        setLoading(false); // Always stop loading after the API call finishes
      }
    };

    getUserData(); // Fetch user data
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching user info
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Auth />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
      />
    </Router>
  );
}

export default App;
