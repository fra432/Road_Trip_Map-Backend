const fs = require("fs");
const path = require("path");

const saveImages = (req, res, next) => {
  const { file, files } = req;

  if (file || files) {
    const imagesToUpload = file ? [file] : files;
    req.imagePaths = [];

    if (imagesToUpload.length !== 0) {
      imagesToUpload.forEach((imageToUpload) => {
        const newFileName = `${Date.now()}-${imageToUpload.originalname}`;
        fs.rename(
          path.join("uploads", "images", imageToUpload.filename),
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
  }

  next();
};

module.exports = saveImages;
