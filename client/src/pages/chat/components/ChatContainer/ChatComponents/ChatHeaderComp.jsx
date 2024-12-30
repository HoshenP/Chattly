import { useChatInfo, useUserInfo } from "@/store/store";
import React from "react";
import { IoClose } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { FaUserFriends } from "react-icons/fa";


export const ChatHeaderComp = () => {
  const { selectedChatData, selectedChatType, closeChat } = useChatInfo();

  return (
    <div className="h-[8vh] w-full flex gap-5 items-center justify-between  text-xl text-center  border-b border-[#beb7b71f] px-6">
      <div>
        {selectedChatType === "private" ? (
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 md:w-12 md:h-12  rounded-full overflow-hidden">
              {selectedChatData.gender == "male" ? (
                <div
                  className={`uppercase h-12 w-12 md:w-12 md:h-12  text-xl bg-[#3b2c7157] text-[#4b57ff]  flex items-center justify-center rounded-full`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              ) : (
                <div
                  className={`uppercase h-12 w-12 md:w-12 md:h-12  text-xl bg-[#712c6257] text-[#f740ba]  flex items-center justify-center rounded-full`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <p>
              {selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className={`bg-[#3aff7c]/10 py-4 px-4 flex items-center justify-center rounded-full`}
            >
              <FaUserFriends className="text-[#3aff7c]"/>

            </div>
            <p>{selectedChatData.name}</p>
          </div>
        )}
      </div>
      <IoClose
        className="w-[20px] hover:scale-125 cursor-pointer transition-all duration-300 text-[#white] text-xl hover:scale-125 hover:bg-[white]/10 rounded-full"
        onClick={() => {
          closeChat();
        }}
      />
    </div>
  );
};
