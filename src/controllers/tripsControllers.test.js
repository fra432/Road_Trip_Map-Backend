const mockTrips = require("../mocks/tripsMock");
const User = require("../models/User");
const { getUserTrips } = require("./tripsControllers");

describe("Given a getUserTrips controller", () => {
  const req = {
    userId: "1",
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When it receives a request with a user id present in the database", () => {
    test("Then it should call the responses's status method with 200 and the json methos with the user's trip", async () => {
      const expectedStatusResponse = 200;

      User.findById = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          trips: mockTrips,
        }),
      }));

      const expectedJsonResponse = {
        trips: mockTrips,
      };

      await getUserTrips(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenLastCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a user id not present in the database", () => {
    test("Then it should call the next received function with the error 'User not found'", async () => {
      const next = jest.fn();

      const expectedErrorMessage = "User not found";
      const error = new Error(expectedErrorMessage);

      User.findById = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue({}),
      }));

      await getUserTrips(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
