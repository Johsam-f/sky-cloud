const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('../prisma');

// Configure Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize: store user ID in session
passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    return done(new Error('User object missing id'));
  }
  done(null, user.id);
});

// Deserialize: fetch full user from ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to attach user to res.locals
const attachUserToLocals = (req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
};

// Protect routes
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

module.exports = {
  passport,
  attachUserToLocals,
  ensureAuthenticated,
};
