const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const authWithToken = require("../middleware/authWithToken");

const User = require("../models/user");

router.get("/users", authWithToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    user.createdAt = new Date();
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    if (e.keyValue) {
      const key = Object.keys(e?.keyValue);
      if (key) {
        return res
          .status(400)
          .send(
            {message: `${e.keyValue[key]} already exists. Please choose different ${key}.`}
          );
      }
    }
    res.status(400).send(e);
  }
});

router.post("/signin", async (req, res) => {
  // const { email, password } = req.body;
  // try {
  //   const user = await User.findByCredentials(email, password);
  //   token = await user.generateAuthToken();
  //   res.send({ user, token });
  // } catch (e) {
  //   res.status(400).send("" + e);
  // }

  const { email, password } = req.body;
  const ERROR_MSG = "Incorrect password or email";
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send(ERROR_MSG);

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
    res.status(400).send(ERROR_MSG);
  }
});

router.delete("/delete", authWithToken, async (req, res) => {
  const users = await User.deleteMany({
    _id: {
      $in: req.body.userIds,
    },
  });
  console.log('//////////');
  console.log({users});
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

module.exports = router;
