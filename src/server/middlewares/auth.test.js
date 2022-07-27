const auth = require("./auth");

const mockReq = { id: 3 };

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: () => mockReq,
}));

describe("Given an auth function", () => {
  describe("When invoked with a valid token", () => {
    const req = {
      headers: {
        authorization: "Bearer 12345",
      },
    };

    test("Then the next function should be invoked", () => {
      const next = jest.fn();

      auth(req, null, next);
    });

    test("Then the userId property should be added to the body object", () => {
      const next = () => {};

      auth(req, null, next);

      expect(req).toHaveProperty("userId", mockReq.id);
    });
  });

  describe("When invoked an invalid token", () => {
    const req = {
      headers: {
        authorization: undefined,
      },
    };

    test("Then the next function should be invoked with an error", () => {
      const expectedErrorMessage = "Invalid token";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      auth(req, null, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
