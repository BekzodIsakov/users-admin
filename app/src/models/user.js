const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { log } = require("util");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  lastSignedAt: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  const ERROR_MSG = "Incorrect password or email";

  if (!user) {
    throw new Error(ERROR_MSG);
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hashedPassword === user.password) {
    if (user.isBlocked === true) {
      throw new Error("Sorry, this user is blocked!");
    }
    return user;
  }
  throw new Error(ERROR_MSG);
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, "SecretKey");

  user.tokens = user.tokens.concat({ token });
  user.lastSignedAt = new Date();
  await user.save();

  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = crypto
      .createHash("sha256")
      .update(user["password"])
      .digest("hex");
    user["password"] = hash;
  }
  next();
});

const User = new mongoose.model("user", UserSchema);
module.exports = User;
