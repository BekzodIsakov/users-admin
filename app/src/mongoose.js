const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://yusuftempr:${encodeURIComponent(
      process.env.ATLAS_ACCOUNT_PASSWORD
    )}@cluster0.lsd3mvv.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log("Database connection success!");
  })
  .catch((err) => {
    console.log("Database connection failed!");
    console.log(err);
  });
