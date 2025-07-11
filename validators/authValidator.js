const { body } = require('express-validator');
const { findUserByEmail } = require('../models/userModel');

exports.validateSignup = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required!')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3 to 30 characters!'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required!')
    .isEmail().withMessage('Enter a valid email!')
    .custom(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error('Email already in use!');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required!')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters!')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain both numbers and letters!'),

  body('confirmPassword')
    .notEmpty().withMessage('Please confirm password!')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
      }
      return true;
    }),
];
