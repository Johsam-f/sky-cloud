const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { createUser } = require('../models/userModel');

exports.signupSubmit = async (req, res) => {
    const errors = validationResult(req);
    const { username, email, password, confirmPassword } = req.body;
    const formData = { username, email };

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.render('auth/signup', { formData });
    }

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        req.flash('error', firstError);
        return res.redirect('/signup');
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
        req.flash('error', 'Something went wrong. Try again.'),
        res.status(500).render('signup', {
            formData: { username, email },
        });
    }
};


