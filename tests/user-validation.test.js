const request = require("supertest");
const app = require("../src/app");

const { populateTestingDB, userOne } = require("./fixtures/db");

beforeEach(populateTestingDB);

/********** Data Validation Tests ***********/

test("Login shouldnt accept invalid email or password format", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: "ahmed", // Invalid Email
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/login")
    .send({
      email: "ahmed@gmail.com",
      password: "password", // Invalid Password: shouldnt contain the word 'password'
    })
    .expect(400);

  await request(app)
    .post("/api/auth/login")
    .send({
      email: "ahmed@gmail.com",
      password: "s", // Invalid Password: should be atleast 8 characters
    })
    .expect(400);
});

test("Signup shouldnt accept invalid email, password, name or age format", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmed.com", // Invalid Email
      name: "ahmed",
      age: 22,
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmed@gmail.com",
      name: 1, // Invalid Name
      age: 22,
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 8, // Invalid Age: should be atleast 10
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 18,
      password: "mystrongpassword", // Invalid Password: shouldnt contain the word 'password'
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signup")
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 18,
      password: "pass", // Invalid Password: should be atleast 8 characters
    })
    .expect(400);
});

test("Updates shouldnt accept invalid email, password, name or age format", async () => {
  await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "ahmed.com", // Invalid Email
      name: "ahmed",
      age: 22,
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "ahmed@gmail.com",
      name: 1, // Invalid Name
      age: 22,
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 8, // Invalid Age: should be atleast 10
      password: "myverystrongpw",
    })
    .expect(400);

  await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 18,
      password: "mystrongpassword", // Invalid Password: shouldnt contain the word 'password'
    })
    .expect(400);

  await request(app)
    .patch("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "ahmed@gmail.com",
      name: "ahmed",
      age: 18,
      password: "pass", // Invalid Password: should be atleast 8 characters
    })
    .expect(400);
});
