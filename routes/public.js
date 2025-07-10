const express = require('express');
const router = express.Router();
const { accessSharedFile } = require('../controllers/shareController');

router.get('/share/:token', accessSharedFile);

module.exports = router;
