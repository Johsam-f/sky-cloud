const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');

exports.signupSubmit = async (req, res) => {
    const errors = validationResult(req);

    const { username, email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.render('auth/signup', {
            errors: errors.array(),
            formData: { username, email }
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({
            username,
            email,
            password: hashedPassword,
        });

        req.flash('success', 'Signup successful! Please log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('signup', {
            errors: [{ msg: 'Something went wrong. Try again.' }],
            formData: { username, email },
        });
    }
};


