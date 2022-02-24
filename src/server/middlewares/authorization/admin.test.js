const { default: ObjectID } = require("bson-objectid");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../../../database");
const User = require("../../../database/models/User");
const admin = require("./admin");

const joselitoId = ObjectID("6217d0769955db3ca2cbc213");
const pepitoId = ObjectID("6217d4769955db5ca2cbc267");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  connectDB(uri);
});
beforeEach(async () => {
  const password = await bcrypt.hash("1234", 3);
  await User.create({
    name: "joselito",
    username: "joselit0",
    _id: joselitoId,
    password,
    admin: true,
  });
  await User.create({
    _id: pepitoId,
    name: "pepito",
    username: "pepit0",
    password,
  });
});
afterEach(async () => {
  await User.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a admin authorization middleware", () => {
  describe("When it's called with a req with userId property and id matches an admin user", () => {
    test("Then it should call function next without error", async () => {
      const req = { userId: joselitoId.toHexString() };
      const res = null;
      const next = jest.fn();

      await admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls.flat()).toHaveLength(0);
    });
  });

  describe("When it's caled with req with userId property and id does not match an admin user", () => {
    test("Then it should call res methods status and json with 403 and {error: 'permission denied'}", async () => {
      const req = { userId: pepitoId.toHexString() };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      const status = 403;
      const json = { error: "permission denied" };

      await admin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(json);
    });
  });

  describe("When it's called with req with a user id that is not registered in the database", () => {
    test("Then it should call method next with a cast error with messasge 'no user with provided id'", async () => {
      const req = { userId: "not matching id" };
      const res = null;
      const next = jest.fn();
      const errorMessage = "no user with provided id";

      await admin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toHaveProperty("message", errorMessage);
    });
  });
});
