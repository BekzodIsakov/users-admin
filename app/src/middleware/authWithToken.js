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

    console.log({user});
    if (!user) throw new Error();
    next();
  } catch (e) {
    console.log("authWithToken catch");
    console.log(e);
    res.redirect(308, "/signin");
    // res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authWithToken;
