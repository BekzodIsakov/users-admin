const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://yusuftempr:H5vAVWf7z9gJetYV@cluster0.lsd3mvv.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log("Database connection success!");
  })
  .catch((err) => {
    console.log("Database connection failed!");
    console.log(err);
  });
