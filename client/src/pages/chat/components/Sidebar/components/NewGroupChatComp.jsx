import { useState, useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useChatInfo } from "../../../../../store/store.js";
import MultipleSelector from "@/components/ui/multiselect";

export const NewGroupChatComp = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useChatInfo();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [channelName, setChannelName] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/user/allusers",
        { withCredentials: true }
      );
      setAllUsers(response.data.contacts);
      console.log(response.data.contacts);
    };
    getAllUsers();
  }, []);

  const createChannel = async () => {
    try {
      // console.log(selectedUsers)
      if (channelName.length > 0 && selectedUsers.length > 0) {
        const response = await axios.post(
          "http://localhost:3000/api/channels/createchannel",
          {
            channelName: channelName,
            channelMembers: selectedUsers.map((user) => user.value),
          },
          { withCredentials: true }
        );
        // console.log(response)
        if (response.data.channel) {
          addChannel(response.data.channel);
          setChannelName("");
          setSelectedUsers([]);
          setDialogOpen(false);
          console.log(response.data.channel);
          setSelectedChatType("channel");
          setSelectedChatData(response.data.channel);
        }
      }
    } catch (error) {}
  };

  return (
    <div>
      <div
        className="flex items-center justify-center rounded-full
"
      >
        {" "}
        <IoAddOutline
          className="text-[#3aff7c] text-xl hover:scale-125 hover:bg-[#3aff7c]/10 rounded-full cursor-pointer transition-all duration-300"
          onClick={() => {
            setDialogOpen(true);
          }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[550px] h-[550px] flex flex-col gap-8 items-center bg-[#0A0A0A] border-none rounded-2xl text-white ">
          <DialogHeader className="mt-6 ">
            <DialogTitle className="text-center">
              Create new group chat
            </DialogTitle>
            <DialogDescription>group chat with you friends</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start justify-center w-full gap-3">
            <p>Channel name</p>
            <Input
              className="rounded-lg py-6 px-4 bg-[#0f0f0f] border-none text-white"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-3">
            <p>Select users</p>
            <MultipleSelector
              className="w-full rounded-lg bg-[#0f0f0f] border-none py-2 text-white"
              defaultOptions={allUsers}
              value={selectedUsers}
              onChange={setSelectedUsers}
              emptyIndicator={
                <p className="w-full text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
            />
          </div>
          <div>
            <Button
              onClick={createChannel}
              className=" w-full text-[#0A0A0A] bg-[#3aff7c] hover:bg-[#3aff7ccc] transition-all duration-300"
            >
              Create group chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
