require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma');
const { passport, attachUserToLocals } = require('./middlewares/auth');
const Router = require('./routes/Router');

const app = express();

// View engine + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Session setup
app.use(session({
  secret: 'a santa at nasa',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // 2 mins
    dbRecordIdIsSessionId: true,
  })
}));

app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(attachUserToLocals);

// Flash locals
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  res.locals.formData = req.flash('formData')[0] || {};
  next();
});

// Routes
app.use('/', Router);

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
