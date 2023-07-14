const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid Email or Password!");

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isCorrectPassword) throw new Error("Invalid Email or Password!");

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1 day",
      }
    );

    user.tokens.push({ token });
    await user.save();
    res.send({ msg: "Logged In!", user, token });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) throw new Error("Email already registered!");

    const newUser = new User(req.body);
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1 day",
    });
    newUser.tokens.push({ token });
    await newUser.save();
    res.status(201).send({ msg: "User Created!", newUser, token });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ msg: "Logged out!", user: req.user });
  } catch (error) {
    next(error);
  }
};
