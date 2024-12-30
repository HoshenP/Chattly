import { useEffect } from "react";
import { useChatInfo, useUserInfo } from "../../store/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarComp } from "./components/Sidebar/SidebarComp";
import { DefaultChatComp } from "./components/DefaultChat/DefaultChatComp";
import { ChatContainerComp } from "./components/ChatContainer/ChatContainerComp";

export const ChatComp = () => {
  const { userInfo } = useUserInfo();
  // console.log(userInfo);

  const { selectedChatType } = useChatInfo();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please make sure you setup your profile");
      navigate("/profile");
    }
  });

  return (
    <div className="flex h-[100vh] items-center justify-center text-white overflow-hidden bg-[#000000] px-6 gap-6">
      <SidebarComp />
      {selectedChatType === undefined ? (
        <DefaultChatComp />
      ) : (
        <ChatContainerComp />
      )}
    </div>
  );
};
