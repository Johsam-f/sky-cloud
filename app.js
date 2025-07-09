require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require("connect-flash");
const helmet = require('helmet');
const morgan = require('morgan');

const { passport, attachUserToLocals } = require('./middlewares/auth');
const Router = require('./routes/Router');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//It applies a sensible default set of protections
// helmet helps secure your Express app by setting various HTTP headers that protect against well-known web vulnerabilities.
app.use(helmet());

// (Morgan) Great for debugging requests, routes, or spotting weird traffic patterns.
//In production, it can help you analyze performance and request logs (especially if piped to a log file).
app.use(morgan('dev')); // 'dev' is a built-in log format

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(attachUserToLocals);

app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("error");
  next();
});

//routes
app.use('/', Router);

// 404 Handler 
app.use((req, res) => {
    res.status(404).render('404');
});
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
});
  
