const express = require("express");
const cors = require('cors')

require("./mongoose");
const usersRouter = require("./routers/users");

const app = express();
app.use(cors())
app.use(express.json());
app.use(usersRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server is live on port " + port);
});
