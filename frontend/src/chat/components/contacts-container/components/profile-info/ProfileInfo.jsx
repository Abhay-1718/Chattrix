import { Avatar } from "@material-tailwind/react";
import { useAppStore } from "../../../../../store";
import { HOST, LOGOUT_ROUTE } from "../../../../../utils/constant";
import { Tooltip, Button } from "@material-tailwind/react";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import apiClient from "../../../../../lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute bottom-0 w-full h-16 flex items-center justify-between px-4 sm:px-8 bg-[#2a2b33] shadow-md rounded-t-lg">
    {/* Left side: Avatar and User Name */}
    <div className="flex gap-3 items-center">
      <div className="relative flex h-12 w-12">
        {userInfo.image ? (
          <Avatar
            className="h-12 w-12 overflow-hidden border-2 border-gray-600"
            src={`${HOST}/${userInfo.image}`}
            alt="avatar"
            variant="rounded"
          />
        ) : (
          <div className="uppercase h-12 w-12 text-lg bg-gray-700 text-white flex items-center justify-center rounded-full">
            {userInfo.firstName
              ? userInfo.firstName[0].toUpperCase()
              : userInfo.email
              ? userInfo.email[0].toUpperCase()
              : ""}
          </div>
        )}
      </div>
      <div className="text-white font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
        {userInfo.firstName && userInfo.lastName
          ? `${userInfo.firstName} ${userInfo.lastName}`
          : ""}
      </div>
    </div>
  
    {/* Right side: Edit & Logout buttons */}
    <div className="flex items-center">
      {/* Edit Profile Button */}
      <Tooltip
        content="Edit Profile"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
        className="bg-gray-700 text-white text-sm shadow-lg"
      >
        <Button
          onClick={() => navigate("/profile")}
          className="text-xl bg-transparent font-medium text-white hover:text-indigo-400 transition duration-200 ease-in-out"
        >
          <FaRegEdit />
        </Button>
      </Tooltip>
  
      {/* Logout Button */}
      <Tooltip
        content="Log Out"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
        className="bg-gray-700 text-white text-sm shadow-lg"
      >
        <Button
          onClick={logOut}
          className="ml-2 text-xl bg-transparent font-medium text-white hover:text-red-400 transition duration-200 ease-in-out"
        >
          <MdLogout />
        </Button>
      </Tooltip>
    </div>
  </div>
    );
};

export default ProfileInfo;
