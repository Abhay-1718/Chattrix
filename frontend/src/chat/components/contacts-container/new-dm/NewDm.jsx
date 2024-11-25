import { Tooltip, Button, Avatar } from "@material-tailwind/react";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";
import apiClient from "../../../../lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "../../../../utils/constant";
import { useAppStore } from "../../../../store";

const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false); // Modal state
  const [searchedContacts, setSearchedContacts] = useState([]); // Searched contacts
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch contacts based on search term
  const searchContacts = async (term) => {
    setIsLoading(true);
    try {
      if (term.trim().length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm: term },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    searchContacts(value);
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      {/* Tooltip and Button for Opening Modal */}
      <Tooltip
        className="bg-[#1c1b1] border-none mb-2 p-3 text-white"
        content="Select New Contact"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
      >
        <Button
          onClick={() => setOpenNewContactModel(true)}
          className="bg-transparent p-0"
        >
          <CiCirclePlus className="text-neutral-400 font-light text-2xl hover:text-neutral-100 cursor-pointer transition-all duration-300" />
        </Button>
      </Tooltip>

      {/* New Contact Modal */}
      <Dialog
        open={openNewContactModel}
        size="xs"
        handler={() => setOpenNewContactModel(false)}
      >
        {/* Modal Header */}
        <DialogBody>
          <div className="grid gap-6">
            <Typography className="text-lg font-semibold text-blue-gray-800">
              Search Contacts
            </Typography>
            <Input
              label="Type to search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Enter contact name or email"
              color="purple"
            />
          </div>

          {/* Contact List */}
          <div className="mt-4 overflow-y-auto max-h-60">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : searchedContacts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
                    onClick={() => selectNewContact(contact)}
                  >
                    {/* Avatar */}
                    <div className="relative flex h-12 w-12">
                      {contact.image ? (
                        <Avatar
                          src={`${HOST}/${contact.image}`}
                          alt="avatar"
                          className="h-12 w-12 rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-gray-700 text-white rounded-full h-12 w-12">
                          {contact.firstName?.charAt(0).toUpperCase() ??
                            contact.email?.charAt(0).toUpperCase() ??
                            ""}
                        </div>
                      )}
                    </div>
                    {/* Contact Info */}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {contact.firstName} {contact.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                {searchTerm.length === 0
                  ? "Start typing to search contacts."
                  : "No contacts found."}
              </div>
            )}
          </div>
        </DialogBody>

        {/* Modal Footer */}
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenNewContactModel(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default NewDm;
