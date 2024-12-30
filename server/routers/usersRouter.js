const express = require("express");
const usersBLL = require("../BLL/usersBLL.js");
const mongoose = require("mongoose");

const validateToken = require("../utils/validateToken.js");

const router = express.Router();

router.get("/userinfo", validateToken, async (req, res) => {
  const response = await usersBLL.getUserInfo(req.userId);
  if (response.message == "User found") {
    return res.send(response.user);
  } else {
    return res.send(response.message);
  }
});

router.put("/updateuser", validateToken, async (req, res) => {
  const { email, firstName, lastName, gender } = req.body;
  if (!email || !firstName || !lastName) {
    return res.send("Missing data");
  } else {
    let response = await usersBLL.updateUser(
      req.userId,
      email,
      firstName,
      lastName,
      gender
    );
    res.send(response);
  }
});

router.post("/searchcontacts", validateToken, async (req, res) => {
  const { searchText } = req.body;
  if (!searchText) {
    return res.send("Missing search term");
  } else {
    let response = await usersBLL.searchContacts(req.userId, searchText);
    if (response.message == "Search successful")
      res.send({ contacts: response.contacts });
  }
});

router.get("/privatechatcontacts", validateToken, async (req, res) => {
  let { userId } = req;
  userId = new mongoose.Types.ObjectId(userId);

  if (!userId) {
    return res.send("User ID is required.");
  } else {
    let response = await usersBLL.getPrivateChatContacts(userId);
    if (response.message == "Contacts retrieved successfully") {
      res.send({ contacts: response.contacts });
    } else {
      res.send(response.message);
    }
  }
});

router.get("/allusers", validateToken, async (req, res) => {
  let response = await usersBLL.getAllUsers(req.userId);
  if (response.message == "Search successful")
    res.send({ contacts: response.contacts });
  else {
    res.send(response.message);
  }
});

module.exports = router;
