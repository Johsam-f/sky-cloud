const { validationResult } = require('express-validator');
const prisma = require('../prisma');

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
