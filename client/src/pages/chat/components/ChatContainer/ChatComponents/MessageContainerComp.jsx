import { useChatInfo, useUserInfo } from "@/store/store";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaArrowDown } from "react-icons/fa";
import { Avatar } from "@radix-ui/react-avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MessageContainerComp = () => {
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useChatInfo();

  const { userInfo } = useUserInfo();

  useEffect(() => {
    const getMessageHistory = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/messages/getmessagehistory",
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessageHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/channels/getchannelmessages/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType == "private") {
        getMessageHistory();
      } else if (selectedChatType == "channel") {
        getChannelMessageHistory();
      }
    }
  }, [selectedChatData, setSelectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "private" && renderPrivateMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    const container = scrollRef.current?.parentElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const renderPrivateMessages = (message) => {
    return (
      <div
        className={`message mb-2 ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#3aff7c]/5 text-[#3aff7c]/90"
              : "bg-[#2a2b33]/20 text-white/80 "
          }  inline-block py-3 px-6 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`message mb-2 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        <div
          className={`${
            message.sender._id === userInfo.id
              ? "bg-[#3aff7c]/5 text-[#3aff7c]/90 "
              : "bg-[#2a2b33]/20 text-white/80 "
          }  inline-block py-3 px-6 rounded my-1 max-w-[50%] break-words ml-9`}
        >
          {message.content}
        </div>
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3 mt-2">
            <div className="flex flex-col">
              {message.sender.gender == "male" ? (
                <span className="text-sm bg-[#3b2c7157] text-[#4b57ff] py-1 px-2 rounded-2xl">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
              ) : (
                <span className="text-sm bg-[#712c6257] text-[#f740ba] py-1 px-2 rounded-2xl">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

              )}
              <span className="text-xs text-gray-600">
                {moment(message.timestamp).format("LT")}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-600 mt-1">
              {moment(message.timestamp).format("LT")}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {renderMessages()}
      <div
        ref={scrollRef}
        // end of messages
        // className="border border-red-500 bg-red-100 h-2 w-full"
      />
      <div className="flex items-center justify-center">
        <button
          onClick={scrollToBottom}
          className="items-center fixed bottom-8 left-50 py-2 px-12 bg-[#0C160F] text-[#3aff7c]/90 rounded-full shadow-lg"
        >
          <FaArrowDown className="text-lg " />
        </button>
      </div>
    </div>
  );
};
