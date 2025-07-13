const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');

// Handle signup form submission
exports.signupSubmit = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return  res.render('auth/signup', { 
      formData: { username, email },
      errorMessages: errors.array()
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ username, email, password: hashedPassword });

    return res.render(
      'auth/login', 
      { formData: {}, errorMessages: [], successMessages: ['Signup successful! Please log in.'] }
    );
  } catch (err) {
    console.error(err);
    return  res.render('auth/signup', { 
      formData: { username, email },
      errorMessages: [ { msg: 'failed to sign up. Please try again.' } ] 
    });
  }
};

exports.logInSubmit = (req, res, next) => {
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
}

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
}
