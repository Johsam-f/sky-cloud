const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const { createFolder } = require('../controllers/folderController');

router.post('/dashboard/folder', ensureAuthenticated, createFolder);

module.exports = router;
