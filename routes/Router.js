const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit, logInSubmit, logout } = require('../controllers/authController');
const upload = require('../middlewares/upload');
const { getDashboard, postCreateFolder, postUploadFile  } = require('../controllers/dashboardController');
const { toggleShare, getFile, getSharedFile } = require('../controllers/fileController');

// Auth pages
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup', { formData: {}, errorMessages: [] });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { formData: {} });
});

// Auth handlers
router.post('/signup', validateSignup, signupSubmit);
router.post('/login', logInSubmit);
router.get('/logout', logout);

// Dashboard
router.get('/dashboard', ensureAuthenticated, getDashboard);
// file handlers
router.get('/dashboard/file/:id', ensureAuthenticated, getFile);
router.get('/dashboard/sharedFile/:id', ensureAuthenticated, getSharedFile);
router.post('/dashboard/file/:id/toggle-share', ensureAuthenticated, toggleShare );
router.post('/dashboard/upload', ensureAuthenticated, upload.single('file'), postUploadFile);
//folder handlers
router.post('/dashboard/folders', ensureAuthenticated, postCreateFolder);

module.exports = router;
