import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "lottie-react";
import animationData from "../../../../../assets/lottie-json.json";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { useChatInfo } from "../../../../../store/store.js";

export const NewChatComp = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const { setSelectedChatType, setSelectedChatData } = useChatInfo();

  const searchContacts = async (searchText) => {
    try {
      if (searchText.length > 0) {
        const response = await axios.post(
          "http://localhost:3000/api/user/searchcontacts",
          { searchText },
          { withCredentials: true }
        );
        // console.log(response.data.contacts);
        if (response.status == 200 && response.data.contacts) {
          setContacts(response.data.contacts);
        }
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectContact = (contact) => {
    setSelectedChatType("private");
    setSelectedChatData(contact);
    setDialogOpen(false);
    setContacts([]);
  };

  return (
    <div>
      <div
        className="flex items-center justify-center rounded-full
"
      >
        <IoAddOutline
          className="text-[#3aff7c] text-xl hover:scale-125 hover:bg-[#3aff7c]/10 rounded-full cursor-pointer transition-all duration-300"
          onClick={() => {
            if (!dialogOpen) {
              setContacts([]);
            }
            setDialogOpen(true);
          }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[550px] h-[550px] flex flex-col gap-8 items-center bg-[#0A0A0A] border-none rounded-2xl text-white ">
          <DialogHeader className="mt-6">
            <DialogTitle>Select a contact to chat with</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <Input
              placeholder="Search Contacts"
              className="rounded-lg py-6 px-8 bg-[#0f0f0f] border-none text-white"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {contacts.length <= 0 && (
            <div className="w-[300px] h-[300px]">
              <Lottie animationData={animationData} height={200} width={200} />
            </div>
          )}
          <ScrollArea className="h-[full] w-full ">
            <div
              key={contacts.length}
              className="flex flex-col gap-4 w-full items-center"
            >
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="w-[400px] flex items-start justify-start py-2 px-8 hover:bg-[#212121] cursor-pointer rounded-xl"
                  onClick={() => {
                    selectContact(contact);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 md:w-12 md:h-12  rounded-full overflow-hidden">
                      {contact.gender == "male" ? (
                        <div
                          className={`uppercase h-12 w-12 md:w-12 md:h-12 text-xl bg-[#3b2c7157] text-[#4b57ff] border-[2px] border-[#4b57ff] flex items-center justify-center rounded-full`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 md:w-12 md:h-12 text-xl bg-[#712c6257] text-[#f740ba] border-[2px] border-[#f740ba] flex items-center justify-center rounded-full`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    {contact.firstName === undefined ||
                    contact.lastName === undefined ? (
                      <div className="flex flex-col items-start ">
                        <p className="text-md text-white">{`${contact.email}`}</p>
                        <p className="text-sm text-[#47474d]">{`${contact.email}`}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start ">
                        <p className="text-md text-white">{`${contact.firstName} ${contact.lastName}`}</p>
                        <p className="text-sm text-[#47474d]">{`${contact.email}`}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// hover:scale-125 cursor-pointer transition-all duration-300
