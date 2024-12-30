import { useState, useEffect } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";

import { useChatInfo, useUserInfo } from "../../../../../store/store.js";
import { useSocket } from "@/socket/socket.jsx";

export const MessageBarComp = () => {
  const socket = useSocket();
  // console.log(socket.current.id)
  const [message, setMessage] = useState("");
  const { selectedChatData, selectedChatType } = useChatInfo();
  const { userInfo } = useUserInfo();


  const sendMessageHandler = async () => {
    if (message != ""){
      if (selectedChatType === "private") {
        socket.current.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          receiver: selectedChatData._id,
        });
      } else if (selectedChatType === "channel") {
        socket.current.emit("sendMessageChannel", {
          sender: userInfo.id,
          content: message,
          channelId: selectedChatData._id
        });
      }

      setMessage("");
    }

  };

  return (
    <div className="h-[10vh] w-full flex flex-row gap-5 items-center justify-center bg-[#0f0f0f] text-center rounded-2xl p-5">
      <input
        type="text"
        className="w-full bg-transparent rounded-md focus:border-none focus:outline-none"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-[#3aff7c]/90 rounded-md flex items-center justify-center p-3 gap-2 focus:border-none focus:outline-none hover:bg-[#3aff7cb6] focus:bg-[#3aff7cb6] transition-all duration-300 "
        onClick={sendMessageHandler}
      >
        <RiSendPlane2Fill className="text-2xl text-[#0C160F]" />
      </button>
    </div>
  );
};
