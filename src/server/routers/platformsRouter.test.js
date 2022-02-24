require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require("..");
const connectDB = require("../../database");
const Platform = require("../../database/models/Platform");
const User = require("../../database/models/User");
const { userLogin } = require("../controllers/usersController");

const netflx = {
  name: "netxflx",
  series: [],
};
const disney = {
  name: "disney",
  series: [],
};

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDB(uri);
});
beforeEach(async () => {
  await Platform.create(disney);
  await Platform.create(netflx);
  const password = await bcrypt.hash("1234", 2);
  await User.create({
    name: "joselito",
    username: "joselit0",
    password,
  });
});
afterEach(async () => {
  await Platform.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a platformsRouter", () => {
  describe("When it receives a get petition at /platforms/ from a not authorized user", () => {
    test("Then it should respond with status 401 and ", async () => {
      const endpoint = "/platforms";
      const expectedStatus = 401;
      const expectedMessage = { error: "Token Missing" };

      const { body } = await request(app).get(endpoint).expect(expectedStatus);

      expect(body).toEqual(expectedMessage);
    });
  });

  describe("When it receives a get petition at /platforms/", () => {
    test("Then it should respond with all platforms in the database and status 200", async () => {
      const endpoint = "/platforms";
      const expectedStatus = 200;
      const expectedNumberOfPlatforms = 2;
      const req = { body: { username: "joselit0", password: "1234" } };
      let token;
      const res = {
        json: (loginToken) => {
          token = loginToken.token;
        },
      };
      const next = null;
      await userLogin(req, res, next);

      console.log(token);
      const { body } = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);

      expect(body).toHaveLength(expectedNumberOfPlatforms);
    });
  });
});
