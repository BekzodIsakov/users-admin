const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authWithToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "SecretKey");
    const user = await User.findOne({
      _id: decoded.id,
      "tokens.token": token,
      isBlocked: false,
    });

    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = authWithToken;
