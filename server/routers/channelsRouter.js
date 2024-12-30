const express = require("express");
const channelsBLL = require("../BLL/channelsBLL.js");

const validateToken = require("../utils/validateToken.js");

const router = express.Router();

router.post("/createchannel", validateToken, async (req, res) => {
  const { channelName } = req.body;
  const { channelMembers } = req.body;
  const channelAdmin = req.userId;
  let response = await channelsBLL.createChannel(
    channelName,
    channelMembers,
    channelAdmin
  );
  if (response.message == "Channel created successfully")
    res.send({ channel: response.channel });
  else {
    res.send(response.message);
  }
});

router.get("/getuserchannels", validateToken, async (req, res) => {
  const userId = req.userId;
  let response = await channelsBLL.getUserChannels(userId);
  // console.log(response)
  if (response.message == "User channels found successfully")
    res.send({ channels: response.channels });
  else {
    res.send(response.message);
  }
});

router.get("/getchannelmessages/:id", validateToken, async (req, res) => {
  const channelId = req.params.id;
  let response = await channelsBLL.getChannelMessages(channelId);
  if (response.message == "Channel message history retrieved successfully")
    res.send({ messages: response.messages });
  else {
    res.send(response.message);
  }
});




module.exports = router;
