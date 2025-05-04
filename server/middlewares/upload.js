const multer = require('multer');
const { bucket } = require('../config/firebase');
const path = require('path');

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload file to Firebase
const uploadToFirebase = async (file, folder = 'books') => {
  if (!file) return null;
  
  const fileName = `${folder}/${Date.now()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', error => reject(error));
    blobStream.on('finish', async () => {
      // Make the file publicly accessible
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve({
        url: publicUrl,
        name: file.originalname,
        type: file.mimetype
      });
    });
    blobStream.end(file.buffer);
  });
};

// Middleware that combines multer and Firebase upload
const uploadMiddleware = (fieldName) => {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      try {
        if (req.file) {
          const fileData = await uploadToFirebase(req.file);
          req.fileData = fileData;
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

module.exports = {
  upload,
  uploadToFirebase,
  uploadMiddleware
};