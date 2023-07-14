const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMW = require("../middlewares/authMW");
const validationMW = require("../middlewares/validationMW");
const { body } = require("express-validator");

router.post(
  "/api/auth/login",
  [
    body("email").isEmail().withMessage("Email should be a valid email!"),
    body("password")
      .isAlphanumeric()
      .withMessage("Password should contain only numbers and characters")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 characters"),
  ],
  validationMW,
  controller.login
);
router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().withMessage("Email should be a valid email!"),
    body("password")
      .isAlphanumeric()
      .withMessage("Password should contain only numbers and characters")
      .isLength({ min: 8 })
      .not()
      .contains("password")
      .withMessage(
        "Weak Password, Password shouldn't contain the word password"
      )
      .withMessage("Password should be atleast 8 characters"),
    body("name").isString().withMessage("Name should be text"),
    body("age")
      .optional()
      .isInt({ min: 10 })
      .withMessage("Age should be a number, atleast 10"),
  ],
  validationMW,
  controller.signup
);

router.post("/api/auth/logout", authMW, controller.logout);

module.exports = router;
