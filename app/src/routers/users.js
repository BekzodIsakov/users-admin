const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const authWithToken = require("../middleware/authWithToken");

const User = require("../models/user");

router.get("/users", authWithToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    user.createdAt = new Date();
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.keyValue) {
      const key = Object.keys(e.keyValue);
      if (key) {
        return res.status(400).send({
          message: `${e.keyValue[key]} is already taken. Please choose different ${key}.`,
        });
      }
    }
    res.status(400).send(error);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const ERROR_MSG = "Incorrect password or email";
  const user = await User.findOne({ email });
  
  if (!user) return res.status(400).send({ message: ERROR_MSG });

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  if (hashedPassword === user.password) {
    if (user.isBlocked)
      res.status(403).send({ message: "Sorry, this user is blocked!" });
    else {
      const token = await user.generateAuthToken();
      res.send({ user, token });
    }
  } else {
    res.status(400).send({ message: ERROR_MSG });
  }
});

router.delete("/delete", authWithToken, async (req, res) => {
  await User.deleteMany({
    _id: {
      $in: req.body.userIds,
    },
  });

  const users = await User.find({});
  res.send(users);
});

router.patch("/update", authWithToken, async (req, res) => {
  await User.updateMany(
    {
      _id: {
        $in: req.body.userIds,
      },
    },
    { isBlocked: req.body.isBlocked }
  );

  const users = await User.find({});
  res.send(users);
});

router.post('/signout', authWithToken, async (req, res) => {
  req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
  await req.user.save()
  res.send();
})

module.exports = router;
