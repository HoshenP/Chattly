import React from "react";
import { useChatInfo, useUserInfo } from "../../../../../store/store.js";
import { Avatar } from "@/components/ui/avatar";
import { FaSignOutAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const UserInfoComp = () => {
  const { userInfo, setUserInfo } = useUserInfo();
  const { setSelectedChatType, setSelectedChatData, selectedChatMessages } = useChatInfo();

  const navigate = useNavigate();

  const disconnect = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/disconnect",
        {},
        { withCredentials: true }
      );
      if (response.data === "Logout successfully") {
        navigate("/auth");
        setUserInfo(undefined);
        setSelectedChatType(undefined);
        setSelectedChatData(undefined);
        selectedChatMessages([]);

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="hover:bg-[#f1f1f111] py-1 px-3 rounded pr-5 flex items-center gap-4"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <Avatar className="h-12 w-12 md:w-12 md:h-12  rounded-full overflow-hidden">
                  {userInfo.gender == "male" ? (
                    <div
                      className={`uppercase h-12 w-12 md:w-12 md:h-12  text-xl bg-[#3b2c7157] text-[#4b57ff]  border-[#4b57ff] flex items-center justify-center rounded-full`}
                    >
                      {userInfo.firstName
                        ? userInfo.firstName.split("").shift()
                        : userInfo.email.split("").shift()}
                    </div>
                  ) : (
                    <div
                      className={`uppercase h-12 w-12 md:w-12 md:h-12  text-xl bg-[#712c6257] text-[#f740ba]  border-[#f740ba] flex items-center justify-center rounded-full`}
                    >
                      {userInfo.firstName
                        ? userInfo.firstName.split("").shift()
                        : userInfo.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
                <div className="flex flex-col justify-start items-start text-start">
                  <p className="w-full text-md text-white">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
                  <p className="text-sm text-[#47474d] flex-wrap ">{`${userInfo.email}`}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-2">
                <MdModeEditOutline />
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <FaSignOutAlt onClick={disconnect} className="text-[#47474d] hover:text-[#f15c5c] transition-all duration-300 cursor-pointer" />
      </div>
    </div>
  );
};
