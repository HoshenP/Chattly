const express = require('express');
const  authBLL  = require('../BLL/authBLL.js');
const jwt = require('jsonwebtoken');



const router = express.Router();

const maxAge = 2 * 24 * 60 * 60 * 1000;
const createToken = (userId, email) => {
    
    return jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, {
      expiresIn: maxAge,
    });
  };

router.post("/register", async (req, res) => {
    let { email } = req.body;
    let { password } = req.body;
    if ( email && password ) {
        let response = await authBLL.registerUser({ email, password });
        if (response.message == "User registered successfully"){
          
            res.cookie("jwt", createToken(response.user.id, response.user.email), {
                maxAge,
                secure: true,
                sameSite: "None",
              });

            return res.status(201).send({...response.user})

        } else {
            if (response.message == "Email address already registered"){
                return res.send(response.message);
            }
            return res.status(400).send(response.message);
        }

    } else {
        return res.status(400).send("Missing email or password");
    }
  });

  router.post("/login", async (req, res) => {
    let { email } = req.body;
    let { password } = req.body;
    if ( email && password ) {
      let response = await authBLL.loginUser({ email, password });
      if (response.message == "User logged in successfully"){
        res.cookie("jwt", createToken(response.user.id, response.user.email), {
          maxAge,
          secure: true,
          sameSite: "None",
        });

      return res.status(200).send({...response.user})
      } else if (response.message == "Password is incorrect" || response.message == "User with the given email address not found"){
        return res.send("Please check your email and password and try again.");
        
      } else {
        return res.status(500).send(response.message);
      }
    } else {
        return res.status(400).send("Missing email or password");
    }
  });

  router.post("/disconnect", async (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
      return res.send("Logout successfully");
    } catch (err) {
      return res.status(500).send(err);
    }
  });



module.exports = router;
