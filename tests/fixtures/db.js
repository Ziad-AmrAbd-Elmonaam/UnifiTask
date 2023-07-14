const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Task = require("../../models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@gmail.com",
  password: "myverystrongpw",
  age: 22,
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Jess",
  email: "jess@gmail.com",
  password: "myverystrongpw",
  age: 22,
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
};

const userWithImgId = new mongoose.Types.ObjectId();
const userWithImg = {
  _id: userWithImgId,
  name: "Larry",
  email: "larry@gmail.com",
  password: "myverystrongpw",
  age: 22,
  image: new mongoose.Types.Buffer("./test-img.jpg"),
  tokens: [{ token: jwt.sign({ _id: userWithImgId }, process.env.JWT_SECRET) }],
};

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
  _id: taskOneId,
  description: "Task One",
  userId: userOneId,
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
  _id: taskTwoId,
  description: "Task Two",
  isCompleted: true,
  userId: userOneId,
};

const taskThreeId = new mongoose.Types.ObjectId();
const taskThree = {
  _id: taskThreeId,
  description: "Task Three",
  userId: userTwoId,
};

const populateTestingDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userWithImg).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  populateTestingDB,
  userOne,
  userTwo,
  userWithImg,
  taskOne,
  taskTwo,
  taskThree,
};
