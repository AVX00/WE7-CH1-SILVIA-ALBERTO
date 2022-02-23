const { notFound, generalError } = require("./errors");

describe("Given a not found handler", () => {
  describe("When it's called with a request and response", () => {
    test("Then it should call response methods status and json with 404 and {error: 'not found'}", () => {
      const expectedStatus = 404;
      const expectedJSON = { error: "not found " };
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();
      const req = {};
      const res = { status: mockStatus, json: mockJson };

      notFound(req, res);

      expect(mockStatus).toHaveBeenCalledWith(expectedStatus);
      expect(mockJson).toHaveBeenCalledWith(expectedJSON);
    });
  });
});

describe("Given a general error handler", () => {
  describe("When it's called with err and res ", () => {
    test("Then it should call res methods status and json with err status and {error: err.message}", () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();
      const err = { status: 400, message: "errorerror" };
      const res = { status: mockStatus, json: mockJson };
      const errorMessage = { error: err.message };
      const req = null;
      const next = null;

      generalError(err, req, res, next);

      expect(mockStatus).toHaveBeenCalledWith(err.status);
      expect(mockJson).toHaveBeenCalledWith(errorMessage);
    });
  });
});
