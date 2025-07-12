const express = require('express');
const router = express.Router();
const { passport, ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit } = require('../controllers/authController');
const upload = require('../middlewares/upload');
const { getDashboard, postCreateFolder, postUploadFile  } = require('../controllers/dashboardController');
const { toggleShare, getFile, getSharedFile } = require('../controllers/fileController');

const dashboardRoutes = require('./dashboard');

const prisma = require('../prisma');

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

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('auth/login', { formData: { email: req.body.email }, errorMessages: [ info.message ] });
    }

    req.logIn(user, err => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});


router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// Dashboard
router.use('/dashboard', dashboardRoutes);
router.get('/dashboard', ensureAuthenticated, getDashboard);
// file handlers
router.get('/dashboard/file/:id', ensureAuthenticated, getFile);
router.get('/dashboard/sharedFile/:id', ensureAuthenticated, getSharedFile);
router.post('/dashboard/file/:id/toggle-share', ensureAuthenticated, toggleShare );
router.post('/dashboard/upload', ensureAuthenticated, upload.single('file'), postUploadFile);
//folder handlers
router.post('/dashboard/folders', ensureAuthenticated, postCreateFolder);

module.exports = router;
