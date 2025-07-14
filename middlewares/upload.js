const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SkyCloud', 
    allowed_formats: [
      'jpg', 'png', 'jpeg',
      'pdf', 'mp4', 'mp3',
      'docx', 'txt', 'zip', 'pptx'
    ],
    use_filename: true,
    unique_filename: true
  }
});

const upload = multer({ storage });

module.exports = upload;
