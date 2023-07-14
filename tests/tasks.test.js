const request = require("supertest");
const app = require("../src/app");

const {
  populateTestingDB,
  userOne,
  taskOne,
  taskThree,
} = require("./fixtures/db");

beforeEach(populateTestingDB);

test("Should create task for authroized user", async () => {
  const response = await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Write my unit-tests",
      isCompleted: false,
    })
    .expect(201);

  expect(response.body.task).toMatchObject({
    description: "Write my unit-tests".toLowerCase(),
    isCompleted: false,
    userId: userOne._id.toString(),
  });
});

test("Shouldnt create task with incorrect datatype", async () => {
  await request(app)
    .post("/api/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 1, //Should be string
      isCompleted: "yup", //Should be boolean
    })
    .expect(400);
});

test("Shouldnt create task for unauthorized user", async () => {
  await request(app)
    .post("/api/tasks")
    .send({
      description: "something important",
    })
    .expect(401);
});

test("Should get authorized user tasks", async () => {
  const response = await request(app)
    .get("/api/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Shouldnt get unauthorized user tasks", async () => {
  await request(app).get("/api/tasks").expect(401);
});

test("Should update authorized user tasks", async () => {
  const response = await request(app)
    .patch(`/api/tasks/${taskOne._id.toString()}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "updated task content",
    })
    .expect(200);
  expect(response.body.msg).toBe("Task updated successfully!");
});

test("Shouldnt update unauthorized user tasks", async () => {
  await request(app)
    .patch(`/api/tasks/${taskOne._id.toString()}`)
    .send({
      description: "This shouldnt work",
    })
    .expect(401);
});

test("Shouldnt update invalid task fields", async () => {
  await request(app)
    .patch(`/api/tasks/${taskOne._id.toString()}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      someOtherField: "Shouldnt work",
    })
    .expect(400);
});

test("Shouldnt update another user's tasks", async () => {
  const response = await request(app)
    .patch(`/api/tasks/${taskThree._id.toString()}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Shouldnt work cause this taskId belongs to userTwo",
    })
    .expect(404);

  expect(response.body.msg).toBe(
    "404 Internal Server Error! Error: Task wasnt found"
  );
});

test("Shouldnt update user's task with incorrect datatypes ", async () => {
  await request(app)
    .patch(`/api/tasks/notValidMongoID`) //should send the valid mongoID of the task
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 123, //should be string
    })
    .expect(400);
});

test("Should delete authorized user task", async () => {
  const response = await request(app)
    .delete(`/api/tasks/${taskOne._id.toString()}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body.msg).toBe("Task deleted successfully!");
});

test("Shouldnt delete unauthorized user tasks", async () => {
  await request(app).delete(`/api/tasks/${taskOne._id.toString()}`).expect(401);
});

test("Shouldnt delete another user's task", async () => {
  const response = await request(app)
    .delete(`/api/tasks/${taskThree._id.toString()}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Shouldnt work cause this taskId belongs to userTwo",
    })
    .expect(404);

  expect(response.body.msg).toBe(
    "404 Internal Server Error! Error: Task wasnt found!"
  );
});

test("Shouldnt delete user's task with invalid task id", async () => {
  await request(app)
    .patch(`/api/tasks/notValidMongoID`) //should send the valid mongoID of the task
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(400);
});
