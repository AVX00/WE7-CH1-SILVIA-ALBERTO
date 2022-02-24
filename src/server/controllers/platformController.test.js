const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const Platform = require("../../database/models/Platform");
const { getPlatforms, createPlatform } = require("./platformController");

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

describe("Given a createNewPlatform", () => {
  describe("When it's called with a request", () => {
    test("Then it should call method res.json with code 201", async () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();
      const expectedStatus = 201;
      const res = { status: mockStatus, json: mockJson };
      const next = null;

      const req = {
        body: { name: "HBO" },
      };

      await createPlatform(req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
      expect(mockJson);
    });
  });
  describe("When it's called and throw an error", () => {
    jest.mock("../../database/models/User", () => ({
      User: () => {
        throw new Error();
      },
    }));
    test("Then it should call method next with error message", async () => {
      const platform = {
        name: "HBO",
        series: ["1", "2"],
      };
      const res = null;
      const req = { body: platform };
      const next = jest.fn();

      await createPlatform(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
