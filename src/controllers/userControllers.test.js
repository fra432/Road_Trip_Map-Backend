const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { mockUserLogin, mockUserRegister } = require("../mocks/usersMock");

const User = require("../models/User");
const { userLogin, userRegister } = require("./userControllers");

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

describe("Given a userRegister function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When invoked with new users credentials in its body", () => {
    test("Then it should call the response's status method with 201", async () => {
      const req = {
        body: mockUserRegister,
      };

      const expectedStatus = 201;

      User.findOne = jest.fn().mockResolvedValue(false);
      bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
      User.create = jest.fn().mockResolvedValue(mockUserRegister);

      await userRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it is called with a user that is already in the database", () => {
    test("Then it should call the 'next' received function with an error 'User already exists'", async () => {
      const req = {
        body: mockUserRegister,
      };

      const expectedErrorMessage = "User already exists";

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(true);

      await userRegister(req, res, next);
      const expectedError = new Error(expectedErrorMessage);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it is called and the User.create method fails", () => {
    test("Then it should call the 'next' received function", async () => {
      const req = {
        body: mockUserRegister,
      };

      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockRejectedValue();

      await userRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
