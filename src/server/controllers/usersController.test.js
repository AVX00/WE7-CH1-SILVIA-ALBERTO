require("dotenv").config();
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const User = require("../../database/models/User");
const { userLogin, userRegister } = require("./usersController");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
}));

let server;
beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const uri = server.getUri();

  connectDB(uri);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("1234", 2);
  await User.create({
    name: "Pepe",
    username: "Pepe",
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

describe("Given a login user controller", () => {
  describe("When it recives a request", () => {
    test("Then if the user exist should receives a token", async () => {
      jest.setTimeout(9000);

      const res = {
        json: jest.fn(),
      };
      const req = { body: { username: "Pepe", password: "1234" } };
      const token = "token";

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token });
    });

    test("Then if the username or the password is wrong it should return an error", async () => {
      const req = { body: { username: "Pepo", password: "1236" } };

      const next = jest.fn();

      const error = new Error("Incorrect password or username");

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a register user controller", () => {
  describe("When it's called with a request", () => {
    test("Then if should be created in db", async () => {
      const req = {
        body: { name: "Pepe", username: "Pepe", password: "1234" },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      User.create = jest.fn().mockResolvedValue(req.body);

      await userRegister(req, res, next);

      expect(User.create).toHaveBeenCalled();
    });
  });
});
