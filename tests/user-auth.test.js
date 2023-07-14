const request = require("supertest");
const app = require("../src/app");

const { populateTestingDB, userOne, userWithImg } = require("./fixtures/db");

beforeEach(populateTestingDB);

/********** Authentication & Authorization Tests ***********/

test("Should logout authorized user", async () => {
  await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test("Shouldnt logout unauthorized user", async () => {
  await request(app).post("/api/auth/logout").expect(401);
});

test("Should logoutall devices of authorized user", async () => {
  const response = await request(app)
    .post("/api/auth/logoutall")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.msg).toBe("Logged all out!");
});

test("Shouldnt logoutall devices of unauthorized user", async () => {
  await request(app).post("/api/auth/logoutall").expect(401);
});

test("Should get profile of authorized user", async () => {
  const response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body).toMatchObject({
    _id: userOne._id.toString(),
    name: userOne.name.toUpperCase(),
    age: userOne.age,
    email: userOne.email,
  });
});

test("Shoudnt get profile of unauthorized user", async () => {
  await request(app).get("/api/users/profile").expect(401);
});

test("Should remove authorized user profile", async () => {
  const response = await request(app)
    .delete("/api/users/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response.body).toEqual({ msg: "User removed successfully!" });
});

test("Shouldnt remove unauthorized user profile", async () => {
  await request(app).delete("/api/users/profile").expect(401);
});

test("Should upload authorized user image", async () => {
  await request(app)
    .post("/api/users/profileImage")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("image", "./tests/fixtures/test-img.jpg")
    .expect(200);
});

test("Shouldnt upload unauthorized user image", async () => {
  await request(app).post("/api/users/profileImage").expect(401);
});

test("Should delete authorized user image", async () => {
  const response = await request(app)
    .delete("/api/users/profileImage")
    .set("Authorization", `Bearer ${userWithImg.tokens[0].token}`)
    .expect(200);

  expect(response.body).toEqual({ msg: "Image removed successfully!" });
});

test("Shouldnt delete unauthorized user image", async () => {
  await request(app).delete("/api/users/profileImage").expect(401);
});
