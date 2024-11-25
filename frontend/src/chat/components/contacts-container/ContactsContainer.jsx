import { useEffect } from "react";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import NewDm from "./new-dm/NewDm";
import apiClient from "../../../lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "../../../utils/constant";
import { useAppStore } from "../../../store";
import ContactsList from "../../../globalComponents/ContactsList";
import Logo from "../../../../public/logo.png"





const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[35vw] xl:w-[20vw] bg-black border-r border-[#e4e5e9] h-full md:h-auto overflow-y-auto">
  {/* Logo Placeholder */}
  <div className="pt-3 px-5">
    <img src={Logo} className="h-10" alt="Logo" />
  </div>

  {/* Direct Message Section */}
  <div className="my-5 px-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-white text-sm md:text-base font-medium">
        DIRECT MESSAGE
      </p>
      <NewDm />
    </div>
    <div className="max-h-[calc(100vh-10rem)] md:max-h-[38vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <ContactsList contacts={directMessagesContacts} />
    </div>
  </div>

  {/* Profile Information */}
  <ProfileInfo />
</div>

  );
}

export default ContactsContainer;
