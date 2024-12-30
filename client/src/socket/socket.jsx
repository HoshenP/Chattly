import { useChatInfo, useUserInfo } from "@/store/store";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useUserInfo();
  const { reorderChannels, reorderPrivateMessages } = useChatInfo();

  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const receiveMessageHandler = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useChatInfo.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.receiver._id)
        ) {
          // console.log("message rcv");
          // console.log(message);

          addMessage(message);
        }
        reorderPrivateMessages(message);
      };

      const receiveChannelMessageHandler = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useChatInfo.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          console.log("message rcv");
          console.log(message);

          addMessage(message);
        }
        reorderChannels(message);
      };

      socket.current.on("receiveMessage", receiveMessageHandler);
      socket.current.on("receiveChannelMessage", receiveChannelMessageHandler);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
