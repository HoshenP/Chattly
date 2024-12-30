const UserModel = require("../models/usersModel");
const MessageModel = require("../models/messagesModel");

const getUserInfo = async (userId) => {
  if (userId) {
    const user = await UserModel.findOne({ _id: userId });
    if (user) {
      return {
        message: "User found",
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          profileSetup: user.profileSetup,
        },
      };
    } else {
      return { message: "User with the given id not found." };
    }
  } else {
    console.log("No user ID provided");
  }
};

const updateUser = async (userId, email, firstName, lastName, gender) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { email, firstName, lastName, gender, profileSetup: true },
      { new: true, runValidators: true }
    );
    return {
      message: "User updated successfully",
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        profileSetup: user.profileSetup,
      },
    };
  } catch (error) {
    return {
      message: "Error while trying to update user",
    };
  }
};

const searchContacts = async (userId, searchTerm) => {
  const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g), "i");

  try {
    const contacts = await UserModel.find({
      $and: [
        { _id: { $ne: userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    return {
      message: "Search successful",
      contacts: [...contacts],
    };
  } catch (error) {
    return {
      message: "Error while trying to fetch contacts",
    };
  }
};

const getPrivateChatContacts = async (userId) => {
  try {
    const contacts = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,

          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          gender: "$contactInfo.gender",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return {
      message: "Contacts retrieved successfully",
      contacts: { contacts },
    };
  } catch (error) {
    return { message: "Error getting user contacts:" };
  }
};

const getAllUsers = async (userId) => {
  try {
    const users = await UserModel.find(
      {
        _id: { $ne: userId },
      },
      "firstName lastName _id email"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : `${user.email}`,

      value: user._id,
    }));

    return {
      message: "Search successful",
      contacts: [...contacts],
    };

  } catch (error) {
    return {
      message: "Error while trying to fetch users",
    };
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  searchContacts,
  getPrivateChatContacts,
  getAllUsers
};
