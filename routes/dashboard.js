const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const { ensureAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const path = require('path');

// Render dashboard
router.get('/', ensureAuthenticated, async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  const files = await prisma.file.findMany({
    where: { userId: req.user.id },
    orderBy: { uploadedAt: 'desc' },
  });

  res.render('dashboard/home', { folders, files });
});

// Create folder
router.post('/folders', ensureAuthenticated, async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    req.flash('error', 'Folder name is required');
    return res.redirect('/dashboard');
  }

  try {
    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });

    req.flash('success', 'Folder created');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create folder');
    res.redirect('/dashboard');
  }
});

// Upload file
router.post('/upload', ensureAuthenticated, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'No file uploaded');
      return res.redirect('/dashboard');
    }

    const { originalname, mimetype, size, filename } = req.file;
    const folderId = req.body.folderId || null;

    await prisma.file.create({
      data: {
        originalName: originalname,
        storedName: filename,
        mimeType: mimetype,
        size: size,
        userId: req.user.id,
        folderId,
      },
    });

    req.flash('success', 'File uploaded successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Upload failed');
    res.redirect('/dashboard');
  }
});

module.exports = router;
