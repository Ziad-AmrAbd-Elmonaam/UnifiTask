const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Unauthorized Operation!");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("No user was found with that token!");

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};
