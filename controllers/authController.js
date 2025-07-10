const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');

// Handle signup form submission
exports.signupSubmit = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  // Preserve user input
  req.flash('formData', { username, email });

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/signup');
  }

  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect('/signup');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ username, email, password: hashedPassword });

    req.flash('success', 'Signup successful! Please log in.');
    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/signup');
  }
};
