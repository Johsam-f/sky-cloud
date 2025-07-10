const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const { body } = require('express-validator');

const dashboardController = require('../controllers/dashboardController');
const folderController = require('../controllers/folderController');

// GET /dashboard – main dashboard page
router.get('/', ensureAuthenticated, dashboardController.renderDashboard);

// POST /dashboard/folders – create new folder
router.post(
  '/folders',
  ensureAuthenticated,
  body('name')
    .trim()
    .notEmpty().withMessage('Folder name is required'),
  folderController.createFolder
);

module.exports = router;
