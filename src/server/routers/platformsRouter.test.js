require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("..");
const connectDB = require("../../database");
const Platform = require("../../database/models/Platform");

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
});
afterEach(async () => {
  await Platform.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a platformsRouter", () => {
  describe("When it receives a get petition at /platforms/", () => {
    test("Then it should respond with all platforms in the database and status 200", async () => {
      const endpoint = "/platforms";
      const expectedStatus = 200;
      const expectedNumberOfPlatforms = 2;

      const { body } = await request(app).get(endpoint).expect(expectedStatus);

      expect(body).toHaveLength(expectedNumberOfPlatforms);
    });
  });
});
