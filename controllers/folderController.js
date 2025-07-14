const { validationResult } = require('express-validator');
const prisma = require('../prisma');
const cloudinary = require('../utils/cloudinary');

exports.deleteFolder = async (req, res) => {
  const folderId = req.params.id;

  try {
    const files = await prisma.file.findMany({
      where: { folderId, userId: req.user.id }
    });

    for (const file of files) {
      if (file.publicId) {
        await cloudinary.uploader.destroy(file.publicId);
      }
    }

    await prisma.file.deleteMany({ where: { folderId, userId: req.user.id } });
    await prisma.folder.delete({ where: { id: folderId } });

    req.flash('success', 'Folder and its files deleted.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Delete folder error:', err);
    req.flash('error', 'Failed to delete folder.');
    res.redirect('/dashboard');
  }
};


exports.createFolder = async (req, res) => {
  const errors = validationResult(req);
  const { name } = req.body;

  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect('/dashboard');
  }

  try {
    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    req.flash('success', 'Folder created successfully.');
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('Error creating folder:', err);
    req.flash('error', 'Failed to create folder. Try again.');
    return res.redirect('/dashboard');
  }
};
