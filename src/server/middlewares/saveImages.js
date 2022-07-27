const fs = require("fs");
const path = require("path");

const saveImages = (req, res, next) => {
  const { files } = req;
  req.imagePaths = [];

  if (files.length !== 0) {
    files.forEach((fileToUpload) => {
      const newFileName = `${Date.now()}-${fileToUpload.originalname}`;
      fs.rename(
        path.join("uploads", "images", fileToUpload.filename),
        path.join("uploads", "images", newFileName),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
      req.imagePaths.push(newFileName);
    });
  }
  next();
};

module.exports = saveImages;
