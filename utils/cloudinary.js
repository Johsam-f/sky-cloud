const cloudinary = require('cloudinary').v2;

cloudinary.config({
    secure: true, // makes urls https, but its optional
    cloudinary_url: process.env.CLOUDINARY_URL,
});

module.exports = cloudinary;
