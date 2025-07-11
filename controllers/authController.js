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
