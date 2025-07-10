const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../middlewares/auth');
const { createShareLink, accessSharedFile } = require('../../controllers/shareController');

router.post('/:id/share', ensureAuthenticated, createShareLink);

module.exports = router;
