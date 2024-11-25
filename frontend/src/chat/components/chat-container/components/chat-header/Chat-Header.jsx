import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../store";
import { Avatar } from "@material-tailwind/react";
import { HOST } from "../../../../../utils/constant";




const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b border-[#2f303b] flex items-center justify-between px-5 md:px-10 lg:px-20 bg-[#1c1d25]">
      {/* User Info Section */}
      <div className="flex gap-3 md:gap-5 items-center">
        {/* Avatar */}
        <div className="relative flex h-10 w-10 md:h-12 md:w-12">
          {selectedChatData.image ? (
            <Avatar
              className="h-full w-full overflow-hidden"
              src={`${HOST}/${selectedChatData.image}`}
              alt="avatar"
              variant="rounded"
            />
          ) : (
            <div className="uppercase h-full w-full text-sm md:text-lg bg-gray-700 text-white flex items-center justify-center rounded-full">
              {selectedChatData.firstName
                ? selectedChatData.firstName[0].toUpperCase()
                : selectedChatData.email
                ? selectedChatData.email[0].toUpperCase()
                : ""}
            </div>
          )}
        </div>

        {/* Name or Email */}
        <div className="text-white text-sm md:text-base font-medium">
          {selectedChatType === "contact" && selectedChatData.firstName
            ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
            : selectedChatData.email}
        </div>
      </div>

      {/* Close Button */}
      <div>
        <button
          className="text-neutral-400 hover:text-white p-2 transition duration-300 focus:outline-none"
          onClick={closeChat}
        >
          <RiCloseFill className="text-xl md:text-2xl" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
