const express = require('express');
const router = express.Router();
const { passport, ensureAuthenticated } = require('../middleware/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit } = require('../controllers/authController');

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup',() => {
    res.render('signup', { errors: [], formData: {} });
});

router.post('/signup', validateSignup, signupSubmit);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));