const MessageModel = require("../models/messagesModel");

const getMessageHistory = async (user1, user2) => {
  try {
    const messageHistory = await MessageModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });
    return { message: "Message history retrieved successfully", messages: messageHistory };
  } catch (error) {
    return { message: "Error occurred while retrieving message history"};
  }
};

module.exports = {
  getMessageHistory,
};
