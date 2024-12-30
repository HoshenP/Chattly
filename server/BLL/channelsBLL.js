const ChannelModel = require("../models/channelModel");
const UserModel = require("../models/usersModel");

const mongoose = require("mongoose");

const createChannel = async (channelName, channelMembers, channelAdmin) => {
  //   console.log("FROM BBL: " + channelName);
  //   console.log("FROM BBL: " + channelMembers);
  //   console.log("FROM BBL: " + channelAdmin);
  try {
    const admin = await UserModel.findById(channelAdmin);
    if (!admin) {
      return { message: "Admin not found" };
    }

    const validatedMembers = await UserModel.find({
      _id: { $in: channelMembers },
    });
    if (validatedMembers.length != channelMembers.length) {
      return { message: "Some members are invalid" };
    }

    let newChannel = new ChannelModel({
      name: channelName,
      members: channelMembers,
      admin: channelAdmin,
    });
    await newChannel.save();

    return { message: "Channel created successfully", channel: newChannel };
  } catch (error) {
    return { message: error.message };
  }
};

const getUserChannels = async (userId) => {
  try {
    const validUserId = new mongoose.Types.ObjectId(userId);
    const userChannels = await ChannelModel.find({
      $or: [{ admin: validUserId }, { members: validUserId }],
    }).sort({ updatedAt: -1 });

    return { message: "User channels found successfully", channels: userChannels };
  } catch (error) {
    return { message: error.message };
  }
};


const getChannelMessages = async (channelId) => {
  try {

    const channel = await ChannelModel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id gender",
      },
    });

    if (!channel) {
      return ({ message: "Channel not found" });
    }

    const messages = channel.messages;
    return ({ message: "Channel message history retrieved successfully" , messages: messages });
  } catch (error) {
    return ({ message: "Error getting channel messages: ", error });
  }
};

module.exports = {
  createChannel,
  getUserChannels,
  getChannelMessages
};
