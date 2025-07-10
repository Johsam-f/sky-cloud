const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Set storage to disk with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
