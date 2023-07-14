const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    let message = result.errors.reduce(
      (accumlated, current) => accumlated + current.msg + " & ",
      ""
    );
    message = message.slice(0, message.length - 3);
    const error = new Error(message);
    error.status = 400;
    throw error;
  }
  next();
};
