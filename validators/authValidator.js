const { body } = require('express-validator');
const { findUserByEmail } = require('../models/userModel');

exports.validateSignup = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required'),

  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required'),

  body('email')
    .trim()
    .isEmail().withMessage('Enter a valid email')
    .custom(async (value) => {
      const user = await findUserByEmail(value);
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),
    ,
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];
