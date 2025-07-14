const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const { validateSignup } = require('../validators/authValidator');
const { signupSubmit, logInSubmit, logout } = require('../controllers/authController');
const upload = require('../middlewares/upload');
const { getDashboard, postCreateFolder } = require('../controllers/dashboardController');
const { uploadFile } = require('../controllers/uploadController')
const { toggleShare, getFile, getSharedFile } = require('../controllers/fileController');
const { deleteFolder } = require('../controllers/folderController');
const { deleteFile, downloadFile } = require('../controllers/fileController')

// Auth pages
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup', { formData: {}, errorMessages: [] });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { formData: {} });
});

// Auth handlers
router.post('/signup', validateSignup, signupSubmit);
router.post('/login', logInSubmit);
router.get('/logout', logout);

// Dashboard
router.get('/dashboard', ensureAuthenticated, getDashboard);
// file handlers
router.get('/dashboard/file/:id', ensureAuthenticated, getFile);
router.get('/dashboard/sharedFile/:id', ensureAuthenticated, getSharedFile);
router.post('/dashboard/file/:id/toggle-share', ensureAuthenticated, toggleShare );
router.post('/dashboard/file/:id/delete', ensureAuthenticated, deleteFile);
router.get('/dashboard/file/:id/download', ensureAuthenticated, downloadFile);

//folder handlers
router.post('/dashboard/folders', ensureAuthenticated, postCreateFolder);
router.post('/dashboard/folder/:id/delete', ensureAuthenticated, deleteFolder);

//file upload
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'video/mp4',
  'audio/mpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
  'application/zip',
  'text/plain'
];
router.post(
  '/dashboard/upload',
  ensureAuthenticated,
  (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        // req.flash('error', 'Upload failed: ' + err.message);
        //return res.redirect('/dashboard');
        // flash messages were misbehaving hence i am doing it manually done here...
        return async (req, res) => {
          try {
            const userId = req.user.id;
            const folders = await getUserFolders(userId);
            const files = await getUserFiles(userId);
            const sharedFiles = await getSharedFiles(userId);
            const error = 'Upload failed: ' + err.message;
            res.render('dashboard/home', {
              folders,
              files,
              sharedFiles,
              errorMessages: [error]
            });
        
          } catch (err) {
            console.error(err);
            req.flash('error', 'Failed to load dashboard.');
            res.redirect('/');
          }
        };
      }

      const file = req.file;
      if (!file) {
        req.flash('error', 'No file uploaded.');
        return res.redirect('/dashboard');
      }

      if (!allowedTypes.includes(file.mimetype)) {
        req.flash('error', 'Unsupported file type.');
        return res.redirect('/dashboard');
      }

      next();
    });
  },
  uploadFile
);


module.exports = router;
