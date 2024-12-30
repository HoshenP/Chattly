import React from "react";
import { ChatHeaderComp } from "./ChatComponents/ChatHeaderComp";
import { MessageBarComp } from "./ChatComponents/MessageBarComp";
import { MessageContainerComp } from "./ChatComponents/MessageContainerComp";

export const ChatContainerComp = () => {
  return (
    <div className="flex flex-col  items-center justify-center h-[90vh] md:w-[80vw] lg:w-[80vw] xl:w-[80vw] bg-[#0A0A0A]  border-[#beb7b75e] rounded-2xl w-full p-6">
      <ChatHeaderComp />
      <MessageContainerComp />
      <MessageBarComp />
    </div>
  );
};
