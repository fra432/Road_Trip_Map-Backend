const { initializeApp } = require("firebase/app");
const path = require("path");
const fs = require("fs");
const {
  uploadBytes,
  ref,
  getDownloadURL,
  getStorage,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBTnNuFcb7yxFCvayt8C3KQ9Z9bqNo6t2w",
  authDomain: "trippy-ba4c0.firebaseapp.com",
  projectId: "trippy-ba4c0",
  storageBucket: "trippy-ba4c0.appspot.com",
  messagingSenderId: "809584211676",
  appId: "1:809584211676:web:66667d6bea1419a3ee2619",
};

const firebaseApp = initializeApp(firebaseConfig);

const saveImage = async (storage, file, fileName) => {
  const storageRef = ref(storage, fileName);
  const metadata = {
    contentType: "image",
  };
  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
};

const firebaseImageStore = async (req, res, next) => {
  const { file, files } = req;

  if (file || files) {
    const storage = getStorage(firebaseApp);
    req.firebaseImagesUrls = [];

    req.imagePaths.map(async (image) => {
      fs.readFile(
        path.join("uploads", "images", image),
        async (readError, readFile) => {
          if (readError) {
            next(readError);
          }

          const firebaseFileURL = await saveImage(storage, readFile, image);
          req.firebaseImagesUrls.push(firebaseFileURL);
          if (req.firebaseImagesUrls.length === req.imagePaths.length) {
            next();
          }
        }
      );
    });
  } else {
    next();
  }
};

module.exports = firebaseImageStore;
