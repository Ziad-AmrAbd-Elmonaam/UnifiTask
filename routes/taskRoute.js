const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/taskController");
const authMW = require("../middlewares/authMW");
const validationMW = require("../middlewares/validationMW");

router
  .route("/api/tasks")
  .post(
    authMW,
    [
      body("description")
        .isString()
        .withMessage("Task's description should be text!"),
      body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("Task's isCompleted should be either true of false!"),
    ],
    validationMW,
    controller.createTask
  )
  .get(authMW, controller.getUserTasks);

router
  .route("/api/tasks/:id")
  .patch(
    authMW,
    [
      param("id")
        .isMongoId()
        .withMessage("Task's id should be a valid MongoID"),
      body("description")
        .optional()
        .isString()
        .withMessage("Task's description should be text!"),
      body("isCompleted")
        .optional()
        .isBoolean()
        .withMessage("Task's isCompleted should be either true of false!"),
    ],
    validationMW,
    controller.updateUserTask
  )
  .delete(
    authMW,
    [
      param("id")
        .isMongoId()
        .withMessage("Task's id should be a valid MongoID"),
    ],
    validationMW,
    controller.removeTask
  )
  .get(
    authMW,
    [
      param("id")
        .isMongoId()
        .withMessage("Task's id should be a valid MongoID"),
    ],
    validationMW,
    controller.getOneTask
  );
module.exports = router;
