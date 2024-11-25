import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Avatar, Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import apiClient from "../lib/api-client";
import setprofile from "../../public/setprofile.jpeg";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../utils/constant";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image updated successfully");
      }
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div className="relative mt-12 w-full max-w-5xl sm:mt-10 flex flex-col sm:flex-row gap-6 px-4 sm:px-0">
        {/* Back Navigation */}
        <div onClick={() => navigate("/chat")}>
          <IoIosArrowBack className="text-4xl lg:text-6xl text-white/90 mb-6 sm:mb-0 cursor-pointer" />
        </div>

        {/* Profile Section */}
        <div className="flex w-full sm:flex-row gap-6 items-start">
          {/* Edit Profile */}
          <div className="w-full sm:w-2/3 flex flex-col gap-6 px-6 py-4 border border-gray-600 rounded-lg">
            <h3 className="text-xl font-semibold text-center">Profile</h3>
            <p className="text-sm text-center text-gray-400 mb-4">
              Edit your profile details.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div
                className="relative flex items-center justify-center h-28 w-28 sm:h-36 sm:w-36 mx-auto sm:mx-0"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {image ? (
                  <Avatar
                    className="h-28 w-28 sm:h-36 sm:w-36"
                    src={image}
                    alt="avatar"
                  />
                ) : (
                  <div className="h-28 w-28 sm:h-36 sm:w-36 bg-gray-700 flex items-center justify-center rounded-full text-2xl text-white">
                    {firstName ? firstName[0] : ""}
                  </div>
                )}
                {hovered && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"
                    onClick={image ? handleDeleteImage : handleFileInputClick}
                  >
                    {image ? (
                      <FaTrash className="text-white text-2xl" />
                    ) : (
                      <FaPlus className="text-white text-2xl" />
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              {/* Input Fields */}
              <div className="flex flex-col gap-4 w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="bg-gray-800 text-black rounded-md p-3"
                />
                <Input
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-800 text-white rounded-md p-3"
                />
                <Input
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-800 text-white rounded-md p-3"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveChanges}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-400"></div>

          {/* Image Section */}
          <div className="hidden sm:flex flex-col items-center gap-4 sm:w-1/3">
            <img
              src={setprofile}
              alt="Decorative"
              className="w-full h-full object-cover rounded-lg border border-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
