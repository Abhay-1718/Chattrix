import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../store";
import moment from "moment";
import apiClient from "../../../../../lib/api-client.js";
import { GET_ALL_MESSAGES_ROUTES, HOST } from "../../../../../utils/constant";
// import { MdFolderZip } from "react-icons/md";
import { IoCloseSharp, IoCloudDownloadOutline } from "react-icons/io5";
// import { progress } from "@material-tailwind/react";




const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages); // Use setter to update the state
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType == "contact") {
        getMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]); // Added setter to dependency array

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|bmp|tiff|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-200 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    // Make the axios request to fetch the file as a blob
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob", // Expect binary data
      onDownloadProgress:(ProgressEvent)=> {
        const {loaded,total} = ProgressEvent;
        const percentCompleted = Math.round((loaded*100)/total)
        setFileDownloadProgress(percentCompleted)
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = urlBlob;
    // Set the download attribute to the file name (use the file name from URL)
    link.setAttribute("download", url.split("/").pop());
    // Append the link to the body and simulate a click to trigger the download
    document.body.appendChild(link);
    link.click();
    // Clean up by removing the link and revoking the object URL
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/50"
            } p-2 inline-block rounded border my-1  max-w-[50%] break-words`}
          >
            <div className="font-semibold">{message.senderName}</div>
            <div>{message.content}</div>
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/50"
            } p-2 inline-block rounded border my-1  max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer "
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={200}
                  width={200}
                  alt=""
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                {/* <span className="text-white/80 text-2xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span> */}
                <span>{message.fileUrl.split("/").pop()}</span>

                <span
                  className="bg-black/20 p-3 text-1xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-200"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoCloudDownloadOutline />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600 ">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full bg-black"> {/* Applied dark background */}
      {renderMessages()}
      <div ref={scrollRef} />
  
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover "
              alt=""
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-1xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-200"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoCloudDownloadOutline />
            </button>
            <button
              className="bg-black/20 p-3 text-1xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-200"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  
}

export default MessageContainer;
