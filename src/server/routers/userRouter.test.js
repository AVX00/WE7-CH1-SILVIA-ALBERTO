const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("..");
const connectDataBase = require("../../database");
const User = require("../../database/models/User");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
}));

let server;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const connectionString = server.getUri();

  await connectDataBase(connectionString);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("1234", 2);
  await User.create({
    name: "Pepe",
    username: "Pepito",
    password: cryptPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given a /users/login endpoint", () => {
  describe("When it receives a POST and a valid user", () => {
    test("Then it should return a property token", async () => {
      const user = { username: "Pepito", password: "1234" };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });
  describe("When it receives a POST and a valid invalid user", () => {
    test("Then it should return an error", async () => {
      const user = { username: "Pepo", password: "1234" };

      const expectedMessage = "Incorrect password or username";

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(401);

      expect(body.error).toBe(expectedMessage);
    });
  });
});

describe("Given a /users/register endpoint", () => {
  describe("When it receives a POST and a valid user", () => {
    test("Then it should created a new user", async () => {
      const user = { name: "Pepe", username: "Pepon", password: "1234" };

      const { body } = await request(app)
        .post("/users/register")
        .send(user)
        .expect(201);

      expect(body.user.username).toBe(user.username);
    });
  });
});
