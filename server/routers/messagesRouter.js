const express = require("express");
const messagesBLL = require("../BLL/messagesBLL.js");

const validateToken = require("../utils/validateToken.js");

const router = express.Router();

router.post("/getmessagehistory", validateToken, async (req, res) => {
  const user1 = req.userId;
  const user2 = req.body.id;

  if (!user1 || !user2) {
    return res.send("Missing both user ID's");
  } else {
    let response = await messagesBLL.getMessageHistory(user1, user2);
    if (response.message == "Message history retrieved successfully")
      res.send({ messages: response.messages });
    else {
      res.send(response.message);
    }
  }
});

module.exports = router;
