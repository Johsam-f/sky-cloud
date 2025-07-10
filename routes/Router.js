const express = require('express');
const router = express.Router();
const { passport, ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit } = require('../controllers/authController');
const upload = require('../middlewares/upload');
const dashboardController = require('../controllers/dashboardController');

const dashboardRoutes = require('./dashboard');

// Auth pages
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  const formData = req.flash('formData')[0] || {};
  const errorMessages = req.flash('error');
  res.render('auth/signup', { formData, errorMessages });
});

router.get('/login', (req, res) => {
  const formData = req.flash('formData')[0] || {};
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('auth/login', { formData, errorMessages, successMessages });
});

// Auth handlers
router.post('/signup', validateSignup, signupSubmit);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info.message);
      req.flash('formData', { email: req.body.email });
      return req.session.save(() => res.redirect('/login'));
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
router.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);
router.post('/dashboard/folders', ensureAuthenticated, dashboardController.postCreateFolder);
router.post('/dashboard/upload', ensureAuthenticated, upload.single('file'), dashboardController.postUploadFile);

module.exports = router;
