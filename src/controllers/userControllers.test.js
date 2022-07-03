const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { mockUserLogin } = require("../mocks/usersMock");

const User = require("../models/User");
const { userLogin } = require("./userControllers");

const mockToken = "token";

describe("Given a userLogin function", () => {
  const req = {
    body: mockUserLogin,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with a user present in the databse", () => {
    test("Then it should call the response's status method with 200 and the json methos with a generated token", async () => {
      const expectedStatus = 200;
      const expectedJsonResponse = {
        token: mockToken,
      };

      User.findOne = jest.fn().mockResolvedValue(true);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jsonwebtoken.sign = jest.fn().mockReturnValue(mockToken);

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a user not present in the databse", () => {
    test("Then it should call the next received function with a message 'Bad request'", async () => {
      const expectedErrorMessage = "Username or Password incorrect";
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);

      await userLogin(req, res, next);

      const expectedError = new Error(expectedErrorMessage);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
