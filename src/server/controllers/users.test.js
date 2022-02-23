const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const userLogin = require("./usersController");

jest.mock("../../database/models/User");

describe("Given a login user controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it recives a response", () => {
    test("Then if the user exist should receives a token", async () => {
      const res = {
        json: jest.fn(),
      };

      const req = {
        body: {
          name: "Pepe",
          password: "1234",
        },
      };
      const token = "token";

      const user = req.body;

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);
      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({ token });
    });
    test("Then if the username or the password it should return an error", async () => {
      const req = {
        body: {
          name: "Pepe",
          password: "1234",
        },
      };
      const user = req.body;
      const next = jest.fn();
      const error = new Error("Incorrect password or username");
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
