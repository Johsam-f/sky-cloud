const express = require('express');
const router = express.Router();
const { passport, ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit } = require('../controllers/authController');

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('auth/login', {
      formData: {},
      errorMessages: req.flash('error'),
      successMessages: req.flash('success'),
    });
  });

router.get('/signup',(req, res) => {
    res.render('auth/signup', { formData: {} });
});

router.post('/signup', validateSignup, signupSubmit);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;