const request = require("supertest");
const app = require("../src/app");

const { populateTestingDB, userOne } = require("./fixtures/db");

beforeEach(populateTestingDB);

/********** User CRUD Operations Tests ***********/
test("Should login existing user", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);

  expect(response.body.user).toMatchObject({
    email: userOne.email,
    name: userOne.name.toUpperCase(),
    age: userOne.age,
  });
});

test("Should not login non-existing user", async () => {
  let response = await request(app)
    .post("/api/auth/login")
    .send({ email: "fakemail@gmail.com", password: userOne.password })
    .expect(400);

  expect(response.body.msg).toBe(
    "400 Internal Server Error! Error: Invalid Email or Password!"
  );

  response = await request(app)
    .post("/api/auth/login")
    .send({ email: userOne.email, password: "notReallyMyPass" })
    .expect(400);

  expect(response.body.msg).toBe(
    "400 Internal Server Error! Error: Invalid Email or Password!"
  );
});

test("Should signup new user", async () => {
  const response = await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmedYassen@gmail.com",
      password: "someValidPass",
      age: 25,
      name: "Ahmed Yassen",
    })
    .expect(201);
  expect(response.body.newUser).toMatchObject({
    email: "ahmedYassen@gmail.com".toLowerCase(),
    age: 25,
    name: "Ahmed Yassen".toUpperCase(),
  });
});

test("Shouldnt signup existing user", async () => {
  const response = await request(app)
    .post("/api/auth/signup")
    .send(userOne)
    .expect(400);
  expect(response.body.msg).toBe(
    "400 Internal Server Error! Error: Email already registered!"
  );
});

test("Should update authenticated-user profile with valid fields", async () => {
  const response = await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      age: 26,
      name: "Ahmed Ibrahim Yassen",
    })
    .expect(200);

  expect(response.body.user).toMatchObject({
    age: 26,
    name: "Ahmed Ibrahim Yassen".toUpperCase(),
  });
});

test("Shouldnt update user with incorrect fields", async () => {
  const response = await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Alexandria" })
    .expect(400);

  expect(response.body.msg).toBe(
    "400 Internal Server Error! Error: Invalid Field(s)!"
  );
});

test("Should delete user profile", async () => {
  const response = await request(app)
    .delete("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.msg).toBe("User removed successfully!");
});
