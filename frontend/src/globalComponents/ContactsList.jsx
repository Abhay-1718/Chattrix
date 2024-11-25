import { useAppStore } from "../store";
import { Avatar } from "@material-tailwind/react";
import { HOST } from "../utils/constant";

const ContactsList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }

    setSelectedChatData(contact);

    // Clear messages if switching to a different contact
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  // Filter out invalid contacts (undefined, null, or missing _id)
  const validContacts = contacts.filter(contact => contact && contact._id);

  return (
    <div className="mt-5">
      {validContacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-4 py-3 transition-all duration-200 cursor-pointer rounded-lg hover:bg-[#f1f1f111] ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] text-white"
              : "text-neutral-800"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-4">
            {!isChannel && (
              <div className="relative h-12 w-12">
                {contact.image ? (
                  <Avatar
                    className="h-12 w-12 overflow-hidden"
                    src={`${HOST}/${contact.image}`}
                    alt="avatar"
                    variant="rounded"
                  />
                ) : (
                  <div className="uppercase h-12 w-12 text-xl bg-gray-700 text-white flex items-center justify-center rounded-full">
                    {/* Display initials */}
                    {contact.firstName
                      ? contact.firstName[0].toUpperCase()
                      : contact.email
                      ? contact.email[0].toUpperCase()
                      : ""}
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col">
              {isChannel ? (
                <div className="flex items-center text-sm font-medium text-[#8417ff]">
                  <div className="bg-[#ffffff22] h-8 w-8 flex items-center justify-center rounded-full">
                    #
                  </div>
                  <span className="ml-2">{contact.name}</span>
                </div>
              ) : (
                <span className="text-sm font-medium text-neutral-800">
                  {`${contact.firstName} ${contact.lastName}`}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsList;
