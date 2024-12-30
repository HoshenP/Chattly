import { create } from "zustand";

export const useUserInfo = create((set, get) => ({
  userInfo: undefined,
  setUserInfo: (newUserInfo) => {
    set(() => ({ userInfo: newUserInfo }));
  },
}));

export const useChatInfo = create((set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  privateMessageContacts: [],
  channels: [],
  setSelectedChatType: (newSelectedChatType) => {
    set(() => ({ selectedChatType: newSelectedChatType }));
  },
  setSelectedChatData: (newSelectedChatData) => {
    set(() => ({ selectedChatData: newSelectedChatData }));
  },
  setSelectedChatMessages: (selectedChatMessages) => {
    set(() => ({ selectedChatMessages: selectedChatMessages }));
  },
  setPrivateMessageContacts: (privateMessageContacts) => {
    set(() => ({ privateMessageContacts: privateMessageContacts }));
  },

  setChannels: (newChannels) => {
    set(() => ({ channels: newChannels }));
  },

  closeChat: () => {
    set(() => ({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }));
  },

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    console.log(message);
    set(() => ({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver:
            selectedChatType === "channel"
              ? message.receiver
              : message.receiver._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    }));
  },

  addChannel: (channel) => {
    const channels = get().channels;

    set(() => ({
      channels: [...channels, channel],
    }));
  },


  reorderChannels: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },

  reorderPrivateMessages: (message) => {
    const userInfo = useUserInfo.getState().userInfo;
    console.log(userInfo)
    const userId = userInfo.id;
    const fromId =
      message.sender._id === userId
        ? message.receiver._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.receiver : message.sender;
    const privateContacts = get().privateMessageContacts;
    const data = privateContacts.find((contact) => contact._id === fromId);
    const index = privateContacts.findIndex((contact) => contact._id === fromId);
    console.log({ data, index, privateContacts, userId, message, fromData });
    if (index !== -1 && index !== undefined) {
      privateContacts.splice(index, 1);
      privateContacts.unshift(data);
    } else {
      privateContacts.unshift(fromData);
    }
    set({ privateMessageContacts: privateContacts });
  }

}));
