const { mockLocations } = require("../mocks/locationsMock");
const Location = require("../models/Location");
const Trip = require("../models/Trip");
const User = require("../models/User");
const {
  addLocation,
  deleteLocation,
  getLocationById,
  getTripLocations,
} = require("./locationsControllers");

describe("Given a getTripLocations function", () => {
  const req = {
    params: {
      tripId: "1",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When it receives a tripId present in the databse in the request params", () => {
    test("Then it should call the response's status method with 200 and the json method with the user's locations", async () => {
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        name: "Barcelona",
        tripId: "1",
        features: mockLocations,
      };

      Trip.findOne = jest.fn(() => ({
        populate: jest.fn().mockReturnValue({
          name: "Barcelona",
          tripId: "1",
          locations: {
            features: mockLocations,
          },
        }),
      }));

      await getTripLocations(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a tripId not present in the databse in the request params", () => {
    test("Then it should call the next received function with an error 'User not found'", async () => {
      const next = jest.fn();
      const expectedErrorMessage = "Trip not found";

      Trip.findOne = jest.fn(() => ({
        populate: jest.fn().mockRejectedValue(),
      }));

      const expectedError = new Error(expectedErrorMessage);

      await getTripLocations(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a addLocation function", () => {
  describe("When it receives a request with a tripId present in the database in the params e all the location info in the body", () => {
    test("Then it should call the responses status method with 200 and the json methos with the new location added", async () => {
      const req = {
        files: ["picture.jpg"],
        firebaseImagesUrls: ["firebasepicture"],
        body: {
          latitude: 41.3787636,
          longitude: 2.1690454,
          description:
            "Huge bronze sculpture of a cat with a bizarre expression by the well-known artist Fernando Botero",
          name: "El Gato de Botlero",
        },
        params: {
          tripId: "1",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        new_location: mockLocations[0],
      };

      const trip = {
        locations: {
          features: [],
        },
      };

      Trip.findById = jest.fn().mockResolvedValue(trip);
      Location.create = jest.fn().mockResolvedValue(mockLocations[0]);
      Trip.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a tripId present in the database in the params e all the location info in the body but without file or files", () => {
    test("Then it should call the responses status method with 200 and the json methos with the new location added", async () => {
      const req = {
        params: {
          tripId: "1",
        },
        body: {
          latitude: 41.3787636,
          longitude: 2.1690454,
          description:
            "Huge bronze sculpture of a cat with a bizarre expression by the well-known artist Fernando Botero",
          name: "El Gato de Botlero",
        },
        files: [],
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        new_location: mockLocations[0],
      };

      const user = {
        locations: {
          features: [],
        },
      };

      Trip.findById = jest.fn().mockResolvedValue(user);
      Location.create = jest.fn().mockResolvedValue(mockLocations[0]);
      Trip.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await addLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a tripId non present in the database", () => {
    test("Then it should invoke the next received function with an error 'Unable to add new location'", async () => {
      const req = {
        file: "picture.jpg",
        firebaseImagesUrls: ["firebasepicture"],
        tripId: "1",
        body: {
          latitude: 41.3787636,
          longitude: 2.1690454,
          description:
            "Huge bronze sculpture of a cat with a bizarre expression by the well-known artist Fernando Botero",
          name: "El Gato de Botlero",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedErrorMessage = "Unable to add new location";
      const error = new Error(expectedErrorMessage);
      const next = jest.fn();

      User.findById = jest.fn().mockRejectedValue();

      await addLocation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a delteLocation function", () => {
  const req = {
    params: {
      locationId: "1",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with a locationId present in the database and a valid tripId", () => {
    test("Then it should call the responses's status method with 200 and the json method with the deleted location", async () => {
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        deleted_location: mockLocations[0],
      };

      Location.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(mockLocations[0]);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      await deleteLocation(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a locationId not present in the database", () => {
    test("Then it should call the next received function with an error 'Location id not found'", async () => {
      const expectedErrorMessage = "Location id not found";
      const error = new Error(expectedErrorMessage);
      const next = jest.fn();

      Location.findByIdAndDelete = jest.fn().mockResolvedValue(false);

      await deleteLocation(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a getLocationById function", () => {
  const req = {
    params: {
      locationId: "1",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with a locationId present in the database", () => {
    test("Then it should call the responses's status method with 200 and the json method with the location", async () => {
      const expectedStatusResponse = 200;
      const expectedJsonResponse = {
        location: mockLocations[0].properties,
      };

      Location.findById = jest.fn().mockResolvedValue(mockLocations[0]);

      await getLocationById(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusResponse);
      expect(res.json).toHaveBeenCalledWith(expectedJsonResponse);
    });
  });

  describe("When it receives a request with a locationId not present in the database", () => {
    test("Then it should call the next received function with an error 'Location not found'", async () => {
      const expectedErrorMessage = "Location not found";
      const error = new Error(expectedErrorMessage);
      const next = jest.fn();

      Location.findById = jest.fn().mockResolvedValue(false);

      await getLocationById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
