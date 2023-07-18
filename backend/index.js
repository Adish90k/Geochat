const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
dotenv.config();


mongoose.connect(process.env.Mongo_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the MongoDB server');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
app.use(express.json());
app.use(cors());
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/messages",messageRoutes);


app.listen(5000,()=>{
    console.log(`server is running at port 5000`);
})