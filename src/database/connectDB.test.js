const connectDB = require(".");

describe("Given a connectDB function", () => {
  describe("When it's called with a wrong connection uri", () => {
    test("Then it should reject to no value", async () => {
      const uri = "asdasdasdasdasdasd";

      await connectDB(uri).catch((error) => {
        expect(error).toBeUndefined();
      });
    });
  });
});
