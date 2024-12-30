const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter.js');
const usersRouter = require('./routers/usersRouter.js');
const messagesRouter = require('./routers/messagesRouter.js');
const channelsRouter = require('./routers/channelsRouter.js');
const { setupSocket } = require('./socket.js');


require('dotenv').config();

const app = express();
app.use(express.json());

app.use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.use(cookieParser());


const connectToDB = require('./configs/connectToDB');
connectToDB();

app.use("/api/auth", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/channels", channelsRouter);



const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})

setupSocket(server);