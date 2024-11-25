import { useState, useEffect, useRef } from "react";
import { IoDocumentAttachOutline, IoSendOutline } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../../store";
import { useSocket } from "../../../../../context/SocketContext";
import apiClient from "../../../../../lib/api-client";
import { UPLOAD_FILE_ROUTE } from "../../../../../utils/constant";




const MessageBar = () => {

  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const fileInputRef = useRef();
  const messageInputRef = useRef(null);
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        !messageInputRef.current.contains(event.target)
      ) {
        setEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        const { addMessage } = useAppStore.getState();
        addMessage(message);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim() === "") {
      console.log("Message content cannot be empty.");
      return;
    }

    if (selectedChatType === "contact") {
      const messageData = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      };

      
      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        } else {
          console.log("File upload failed: ", response.data);
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log("Error during file upload:", error);
    }
  };

  return (
    <div className="h-[12vh] bg-[#1c1d25] flex items-center justify-between px-4 sm:px-6 md:px-10 gap-4 mb-4 shadow-md">
      <div className="flex-1 flex bg-[#2a2b33] rounded-lg items-center gap-3 sm:gap-4 px-3 py-2">
        <input
          ref={messageInputRef}
          type="text"
          className="flex-1 text-sm sm:text-base p-2 sm:p-4 bg-transparent rounded-md text-white placeholder-neutral-400 focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none"
          onClick={handleAttachmentClick}
        >
          <IoDocumentAttachOutline className="text-xl sm:text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        <div className="relative">
          <button
            onClick={() => setEmojiPicker(!emojiPicker)}
            className="text-neutral-400 hover:text-white transition duration-200 focus:outline-none"
          >
            <RiEmojiStickerLine className="text-xl sm:text-small" />
          </button>
          {emojiPicker && (
            <div ref={emojiRef} className="absolute bottom-12 right-0 z-10">
              <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} />
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 hover:bg-[#a868f0b2] transition duration-200 focus:outline-none shadow-lg"
      >
        <IoSendOutline className="text-xl sm:text-2xl text-white" />
      </button>
    </div>
  );
}

export default MessageBar;
