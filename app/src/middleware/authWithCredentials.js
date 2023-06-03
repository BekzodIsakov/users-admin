// UserSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });
//   const ERROR_MSG = "Incorrect password or email";

//   if (!user) {
//     console.log("User not found!");
//     throw new Error(ERROR_MSG);
//   }

//   const hashedPassword = crypto
//     .createHash("sha256")
//     .update(password)
//     .digest("hex");

//   if (hashedPassword === user.password) {
//     if (user.isBlocked === true) {
//       throw new Error("Sorry, this user is blocked!")
//     }
//     return user;
//   }
//   throw new Error(ERROR_MSG);
// };

// const User = require("../models/user");
// const crypto = require("crypto");

// const authWithCredentials = async (req, res, next) => {
//   const {email, password} = req.body;
//     const ERROR_MSG = "Incorrect password or email";
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).send(ERROR_MSG);

//     const hashedPassword = crypto
//       .createHash("sha256")
//       .update(password)
//       .digest("hex");
//       if (hashedPassword === user.password) {
//         if (user.isBlocked) return res.status(403).send('Sorry, this user is blocked!')
//         send(user)
//       }
// };
