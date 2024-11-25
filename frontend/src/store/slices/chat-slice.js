// Create a slice of state for managing chat data using Zustand
export const createChatSlice = (set, get) => ({
  // State variables to hold the current chat information
  selectedChatType: undefined, // The type of the selected chat (e.g., "private", "group")
  selectedChatData: undefined, // Data related to the selected chat (e.g., chat details, participants)
  selectedChatMessages: [], // The list of messages for the selected chat
  directMessagesContacts: [], // Direct message contacts


  isUploading:false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgress:0,



  setIsUploading:(isUploading) => set({isUploading}),
  setIsDownloading:(isDownloading) => ({isDownloading}),
  setFileUploadProgress:(fileUploadProgress) => ({fileUploadProgress}),
  setFileDownloadProgress:(fileDownloadProgress) => ({fileDownloadProgress}),


  // Action to set the selected chat type
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),

  // Action to set the selected chat data
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),

  // Action to set the selected chat messages
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

  // Action to set direct message contacts
  setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),

  // Action to close the chat and reset chat-related state
  closeChat: () =>
    set({
      selectedChatData: undefined, // Reset selected chat data
      selectedChatType: undefined, // Reset selected chat type
      selectedChatMessages: [], // Clear the chat messages
    }),

  // Action to add a message to the selected chat
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    // Format the message based on chat type (channel or private)
    const formattedMessage = {
      ...message,
      recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
      sender: selectedChatType === "channel" ? message.sender : message.sender._id,
    };

    // Update the selected chat messages
    set({
      selectedChatMessages: [...selectedChatMessages, formattedMessage],
    });
  },
});
