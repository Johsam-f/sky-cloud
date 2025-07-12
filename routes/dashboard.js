const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ensureAuthenticated } = require('../middlewares/auth');
const prisma = require('../prisma');

const upload = multer({
  dest: path.join(__dirname, '../uploads'), // Save uploaded files here
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// POST /dashboard/folder/create - Create a folder
router.post('/folder/create', ensureAuthenticated, async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName || folderName.trim().length === 0) {
      req.flash('error', 'Folder name cannot be empty');
      return res.redirect('/dashboard');
    }
    await prisma.folder.create({
      data: { name: folderName.trim(), userId: req.user.id },
    });
    req.flash('success', 'Folder created successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create folder');
    res.redirect('/dashboard');
  }
});

// POST /dashboard/file/upload - Upload a file (with optional folder)
router.post(
  '/file/upload',
  ensureAuthenticated,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        req.flash('error', 'No file uploaded');
        return res.redirect('/dashboard');
      }

      const { originalname, filename, mimetype, size } = req.file;
      const { folderId } = req.body;

      // Validate folder ownership if folderId is provided
      if (folderId) {
        const folder = await prisma.folder.findUnique({
          where: { id: folderId },
        });
        if (!folder || folder.userId !== req.user.id) {
          req.flash('error', 'Invalid folder selected');
          return res.redirect('/dashboard');
        }
      }

      await prisma.file.create({
        data: {
          userId: req.user.id,
          folderId: folderId || null,
          originalName: originalname,
          storedName: filename,
          mimeType: mimetype,
          size,
        },
      });

      req.flash('success', 'File uploaded successfully');
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Failed to upload file');
      res.redirect('/dashboard');
    }
  }
);

// POST /dashboard/folder/:id/delete - Delete a folder (and its files)
router.post('/folder/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const folderId = req.params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!folder || folder.userId !== req.user.id) {
      req.flash('error', 'Folder not found or unauthorized');
      return res.redirect('/dashboard');
    }

    // Delete all files inside folder first (and files from disk)
    const filesInFolder = await prisma.file.findMany({
      where: { folderId: folderId },
    });
    for (const file of filesInFolder) {
      // Delete from disk
      const filePath = path.join(__dirname, '../uploads', file.storedName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      // Delete from DB
      await prisma.file.delete({ where: { id: file.id } });
    }

    // Delete folder
    await prisma.folder.delete({ where: { id: folderId } });

    req.flash('success', 'Folder and its files deleted');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete folder');
    res.redirect('/dashboard');
  }
});

// POST /dashboard/file/:id/delete - Delete a file
router.post('/file/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized');
      return res.redirect('/dashboard');
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', file.storedName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete file from DB
    await prisma.file.delete({ where: { id: fileId } });

    req.flash('success', 'File deleted successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete file');
    res.redirect('/dashboard');
  }
});

// GET /dashboard/file/:id/download - Download a file
router.get('/file/:id/download', ensureAuthenticated, async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized');
      return res.redirect('/dashboard');
    }

    const filePath = path.join(__dirname, '../uploads', file.storedName);

    if (!fs.existsSync(filePath)) {
      req.flash('error', 'File does not exist on server');
      return res.redirect('/dashboard');
    }

    res.download(filePath, file.originalName);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to download file');
    res.redirect('/dashboard');
  }
});

module.exports = router;
