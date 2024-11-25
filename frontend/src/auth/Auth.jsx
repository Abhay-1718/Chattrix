import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../lib/api-client.js';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/index.js";
import Logo from "../../public/logo.png";
import HeroImage from "../../public/hero-image.jpeg";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const { setUserInfo } = useAppStore();

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required", { position: "top-right", autoClose: 3000 });
      return false;
    }
    if (!password.length) {
      toast.error("Password is required", { position: "top-right", autoClose: 3000 });
      return false;
    }
    return true;
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        if (response.data.status) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        } else {
          toast.error(response.data.message || "Login failed. Please try again.", { position: "top-right", autoClose: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again later.", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        if (response.data.status) {
          toast.success("Signup successful!", { position: "top-right", autoClose: 3000 });
          setUserInfo(response.data.user);
          navigate("/profile");
        } else {
          toast.error(response.data.message || "Signup failed. Please try again.", { position: "top-right", autoClose: 3000 });
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again later.", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required", { position: "top-right", autoClose: 3000 });
      return false;
    }
    if (!password.length) {
      toast.error("Password is required", { position: "top-right", autoClose: 3000 });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match", { position: "top-right", autoClose: 3000 });
      return false;
    }
    return true;
  };

  return (
    <div className="bg-black text-white flex min-h-screen items-center justify-center p-4">
      <ToastContainer />
      <div className="flex w-full max-w-5xl flex-col md:flex-row items-stretch">
        {/* Left Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 border rounded-lg border-gray-700 bg-black flex flex-col justify-center">
          <a href="#">
            <div className="text-foreground font-semibold text-2xl tracking-tighter flex items-center gap-2 mb-8">
              <img src={Logo} className="h-10" alt="Logo" />
            </div>
          </a>
          <div>
            <h3 className="text-2xl font-bold">
              {isLoginMode ? "Login" : "Sign Up"}
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              {isLoginMode
                ? "Welcome back, enter your credentials to continue."
                : "Create an account to get started."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray text-sm border-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray text-sm border-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Padding right for icon space
                required
              />
              <div
                className="absolute top-11 transform -translate-y-1/2 right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEye className="text-black" size={20} />
                ) : (
                  <FiEyeOff className="text-black" size={20} />
                )}
              </div>
            </div>
            {!isLoginMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray text-sm border-none text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            <div className="mt-4 flex items-center justify-end gap-x-2">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
              >
                {isLoginMode ? "Sign Up" : "Login"}
              </button>
              <button
                type="submit"
                className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-white text-black h-10 px-4 py-2"
              >
                {isLoginMode ? "Log in" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>

        {/* Divider */}
        <div className="hidden md:flex flex-col items-center mx-6">
          <div className="w-px h-full bg-gray-600"></div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:flex flex-col items-center gap-4 w-1/2">
          <img
            src={HeroImage}
            alt="Illustration"
            className="max-w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
