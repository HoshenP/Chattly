import { useChatInfo } from "@/store/store";
import { Avatar } from "@radix-ui/react-avatar";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FaUserFriends } from "react-icons/fa";



export const ContactsListComp = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatType,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useChatInfo();

  const selectContactHandler = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("private");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-2">
      {/* <ScrollArea className="h-[full] w-full "> */}
        {contacts.map((contact) => {
          return (
            <div
              key={contact._id}
              className={`pl-2 py-2  transition-all duration-300 cursor-pointer ${
                selectedChatData && selectedChatData._id === contact._id
                  ? "bg-[#f1f1f111] hover:bg-[#f1f1f110]"
                  : "hover:bg-[#f1f1f111] "
              }`}
              onClick={() => selectContactHandler(contact)}
            >
              <div className="flex gap-5 items-center justify-start text-neutral-300 pl-8">
                {!isChannel && (
                  <Avatar className="h-10 w-10 md:w-10 md:h-10 sm:h-10 sm:w-10 rounded-full ">
                    {contact.gender == "male" ? (
                      <div
                        className={`uppercase h-10 w-10 md:w-10 md:h-10  text-xl bg-[#3b2c7157] text-[#4b57ff]  flex items-center justify-center rounded-full`}
                      >
                        {contact.firstName
                          ? contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    ) : (
                      <div
                        className={`uppercase h-10 w-10 md:w-10 md:h-10  text-xl bg-[#712c6257] text-[#f740ba]  flex items-center justify-center rounded-full`}
                      >
                        {contact.firstName
                          ? contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                )}
                {isChannel && (
                  <div
                    className={` text-[#3aff7c] bg-[#3aff7c]/10 h-10 w-10 flex items-center justify-center rounded-full`}
                  >
                    <FaUserFriends />

                  </div>
                )}
                {isChannel ? (
                  <span>{contact.name}</span>
                ) : (
                  <span>{contact.firstName
                    ? `${contact.firstName} ${contact.lastName}`
                    : contact.email}</span>
                )}
              </div>
            </div>
          );
        })}
      {/* </ScrollArea> */}
    </div>
  );
};
