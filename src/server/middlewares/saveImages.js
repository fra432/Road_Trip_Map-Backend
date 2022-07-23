const fs = require("fs");
const path = require("path");

const saveImages = (req, res, next) => {
  const { file, files } = req;
  req.imagePaths = [];

  if (files || file) {
    const filesToUpload = file ? [file] : files;
    filesToUpload.forEach((fileToUpload) => {
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
