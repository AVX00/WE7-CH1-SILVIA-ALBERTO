const { default: ObjectID } = require("bson-objectid");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const Platform = require("../../database/models/Platform");
const { getPlatforms } = require("./platformController");

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

describe("Given a getPlatforms controller", () => {
  describe("When it's called with res", () => {
    test("Then it should call method res.json with all platforms at the database", async () => {
      const platforms = await Platform.find();
      const mockJson = jest.fn();
      const res = {
        json: mockJson,
      };
      const req = null;
      const next = null;

      await getPlatforms(req, res, next);

      expect(mockJson).toHaveBeenCalledWith(platforms);
    });
  });

  describe("When it's called and an error is throwed", () => {
    jest.mock();
    jest.mock("../../database/models/Platform", () => ({
      Platform: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    }));
    test("Then it should call method next with error message 'error getting Platforms'", async () => {
      const req = null;
      const res = null;
      const next = jest.fn();

      await getPlatforms(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
