const mongoose = require("mongoose");
const validator = require("validator");
require('dotenv').config();

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
  tokens: [{token: {
    type: String,
    required: true
  }}]
});

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  const ERROR_MSG = "Incorrect password or email";

  if (!user) {
    console.log('not found');
    throw new Error(ERROR_MSG);
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hashedPassword === user.password) {
    return user;
  }
  throw new Error(ERROR_MSG);
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({id: user._id.toString()}, 'SecretKey')

  user.tokens = user.tokens.concat({token})
  await user.save();

  return token;
}

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

const User = new mongoose.model('user', UserSchema)
module.exports = User;