const Task = require("../models/task");

module.exports.createTask = async (req, res, next) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user._id,
    });
    await task.save();
    res.status(201).send({ msg: "Task Created!", task });
  } catch (error) {
    next(error);
  }
};



module.exports.updateUserTask = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedFields = ["description", "isCompleted"];

    const isValidUpdate = updates.every((update) =>
      allowedFields.includes(update)
    );

    if (!isValidUpdate) throwCustomError("Invalid Field(s)!", 400);

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body
    );
    if (!task) throwCustomError("Task wasnt found", 404);

    await task.save();
    res.send({ msg: "Task updated successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports.removeTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) throwCustomError("Task wasnt found!", 404);
    res.send({ msg: "Task deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports.getOneTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throwCustomError("Task wasnt found!", 404);
    res.send(task);
  } catch (error) {
    next(error);
  }
};

//-Helper function
const throwCustomError = (msg, status) => {
  let error = new Error(msg);
  error.status = status;
  throw error;
};
