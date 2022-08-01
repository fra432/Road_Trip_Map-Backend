const mockTrips = require("../mocks/tripsMock");
const { mockUser } = require("../mocks/usersMock");
const Trip = require("../models/Trip");
const User = require("../models/User");
const { getUserTrips, addTrip } = require("./tripsControllers");

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

describe("Given a addTrip controller", () => {
  const req = {
    userId: "1",
    body: {
      name: "Costa brava",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When it receives a request with a userId and the trip name", () => {
    test("Then it should call the responses' status method with 200 and the json method with the new trip created", async () => {
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        new_trip: mockTrips[0],
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      Trip.create = jest.fn().mockResolvedValue(mockTrips[0]);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await addTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenLastCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a userId and the trip name", () => {
    test("Then it should call the responses' status method with 200 and the json method with the new trip created", async () => {
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        new_trip: mockTrips[0],
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      Trip.create = jest.fn().mockResolvedValue(mockTrips[0]);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await addTrip(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenLastCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a user id not present in the database", () => {
    test("Then it should call the next received function with an error 'Unable to add new trip'", async () => {
      const next = jest.fn();
      const expectedErrorMessage = "Unable to add new trip";
      const error = new Error(expectedErrorMessage);

      User.findById = jest.fn().mockRejectedValue({});

      await addTrip(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
