const express = require('express');
const router = express.Router();
const { createShareLink, accessSharedFile } = require('../controllers/shareController');
const { ensureAuthenticated } = require('../middlewares/auth');

// Generate share link for a file
router.post('/dashboard/file/:id/share', ensureAuthenticated, createShareLink);

// Public route to access shared file
router.get('/share/:token', accessSharedFile);

module.exports = router;
