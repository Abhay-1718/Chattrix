import { useEffect } from "react";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactsContainer from "./components/contacts-container/ContactsContainer";
import EmptyChatContainer from "./components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "./components/chat-container/ChatContainer";




const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen text-white bg-[#121212] overflow-hidden">
      {
        isUploading &&
        <div
        className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-xl"
        >
          <h5
           className="text-5xl animate-pulse "
          >
            Uploading File Text
          </h5>
          {fileUploadProgress}%
        </div>
      }



{
        isDownloading &&
        <div
        className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-xl"
        >
          <h5
           className="text-5xl animate-pulse "
          >
            Downloading File
          </h5>
          {fileDownloadProgress}%
        </div>
      }

      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;
