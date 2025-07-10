const express = require('express');
const router = express.Router();
const { passport, ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit } = require('../controllers/authController');

// Root route
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Signup page
router.get('/signup', (req, res) => {
  const formData = req.flash('formData')[0] || {};
  const errorMessages = req.flash('error');
  res.render('auth/signup', { formData, errorMessages });
});

// Login page
router.get('/login', (req, res) => {
  const formData = req.flash('formData')[0] || {};
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('auth/login', { formData, errorMessages, successMessages });
});

// Handle signup form
router.post('/signup', validateSignup, signupSubmit);

// Handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash('error', info.message);
      req.flash('formData', { email: req.body.email });
      return req.session.save(() => res.redirect('/login'));
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/home');
    });
  })(req, res, next);
});

// Home route (protected)
router.get('/home', ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.username}!`);
});

module.exports = router;
