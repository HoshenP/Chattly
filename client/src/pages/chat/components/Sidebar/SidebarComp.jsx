import React, { useEffect } from "react";
import { UserInfoComp } from "./components/UserInfoComp";
import { NewChatComp } from "./components/NewChatComp";
import axios from "axios";
import { useChatInfo } from "@/store/store";
import { ContactsListComp } from "./components/ContactsListComp";
import { NewGroupChatComp } from "./components/NewGroupChatComp";

export const SidebarComp = () => {
  const {
    privateMessageContacts,
    setPrivateMessageContacts,
    channels,
    setChannels,
  } = useChatInfo();

  useEffect(() => {
    const getContacts = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/user/privatechatcontacts",
        { withCredentials: true }
      );
      if (response.data.contacts) {
        setPrivateMessageContacts(response.data.contacts.contacts);
      }
    };

    const getChannels = async () => {
      console.log("here");
      const response = await axios.get(
        "http://localhost:3000/api/channels/getuserchannels",
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setPrivateMessageContacts]);

  return (
    <div className="relative h-[90vh] md:w-[45vw] lg:w-[35vw] xl:w-[25vw] flex flex-col justify-between bg-[#0A0A0A]  border-[#beb7b75e] rounded-2xl w-full">
      <div className="py-6">
        <h3 className="w-fit text-white text-2xl font-bold text-border-2 text-border-sky-500 pl-8">
          Chattly
        </h3>
        <div className="mt-5 mb-3 ">
          <div className="flex items-center justify-between pr-6">
            <p className="text-[#47474d] pl-8"> PRIVATE CHATS</p>
            <NewChatComp />
          </div>
          <div className="max-h-[39vh] overflow-y-auto no-scrollbar">
            <ContactsListComp contacts={privateMessageContacts} />
          </div>
          {/* here */}
        </div>
        <div className="mt-5 mb-3">
          <div className="flex items-center justify-between pr-6">
            <p className="text-[#47474d] pl-8"> GROUP CHATS</p>
            <NewGroupChatComp />
          </div>
          <div className="max-h-[43vh] overflow-y-auto scrollbar-hidden no-scrollbar">
              <ContactsListComp contacts={channels} isChannel={true} />
          </div>
        </div>
      </div>
      {/* add icon before */}

      <div className=" border-t border-[#beb7b71f] px-6 py-4">
        <UserInfoComp />
      </div>
    </div>
  );
};
