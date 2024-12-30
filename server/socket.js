const socketIO = require("socket.io");
const MessageModel = require("./models/messagesModel");
const ChannelModel = require("./models/channelModel");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log("Client disconnected", socket.id);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const recevierSocketId = userSocketMap.get(message.receiver);
    const senderSocketId = userSocketMap.get(message.sender);

    const newMessage = await MessageModel.create(message);

    const messageData = await MessageModel.findById(newMessage._id)
      .populate("sender", "id email firstName lastName gender")
      .populate("receiver", "id email firstName lastName gender")
      .exec();

    if (recevierSocketId) {
      io.to(recevierSocketId).emit("receiveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendMessageChannel = async (message) => {
    const recevierSocketId = userSocketMap.get(message.receiver);
    const senderSocketId = userSocketMap.get(message.sender);

    const newMessage = await MessageModel.create({
      sender: message.sender,
      receiver: null,
      content: message.content,
      timestamp: new Date(),
    });

    const messageData = await MessageModel.findById(newMessage._id)
      .populate("sender", "id email firstName lastName gender")
      .exec();

    await ChannelModel.findByIdAndUpdate(message.channelId, {
      $push: { messages: newMessage._id },
    });

    const channel = await ChannelModel.findById(message.channelId).populate(
      "members"
    );

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSockedId = userSocketMap.get(member._id.toString());
        if (memberSockedId) {
          io.to(memberSockedId).emit("receiveChannelMessage", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveChannelMessage", finalData);
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    socket.on("sendMessage", sendMessage);
    // I ADDED THIS VVVV
    socket.on("sendMessageChannel", sendMessageChannel);
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = {
  setupSocket,
};
