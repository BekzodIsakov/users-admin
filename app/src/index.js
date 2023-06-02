const express = require("express");
require('./mongoose');

const app = express();

app.get("/", (req, res) => {
  res.send("USERs");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server is live on port " + port);
});
