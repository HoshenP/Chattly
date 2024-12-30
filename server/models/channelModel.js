const mongoose = require("mongoose");

const ChannelsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ChannelsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ChannelsSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const ChannelModel = mongoose.model("channel", ChannelsSchema, "channels");

module.exports = ChannelModel;
