import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../../assets/lottie-json.json";

import { useUserInfo } from "../../../../store/store.js";


export const DefaultChatComp = () => {
    const { userInfo } = useUserInfo();
    console.log(userInfo);

  return (
    <div className="flex flex-col  items-center justify-center h-[90vh] md:w-[80vw] lg:w-[80vw] xl:w-[80vw] bg-[#0A0A0A]   border-[#beb7b75e] rounded-2xl w-full p-6">
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl text-center">
        <h3 className="">
          Hi <span className="font-bold">{`${userInfo.firstName}`}</span>, <br/> So who we're texting today?
          
        </h3>
      </div>
      <Lottie animationData={animationData} height={200} width={200} />

    </div>
  );
};
