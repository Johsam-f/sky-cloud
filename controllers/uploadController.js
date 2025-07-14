const { createFile } = require('../models/fileModel');

exports.uploadFile = async (req, res) => {
    try {
        const userId = req.user.id;
        const folderId = req.body.folderId || null;
        const file = req.file;
  
        if (!file) {
            req.flash('error', 'Please select a file to upload.');
            return res.redirect('/dashboard');
        }

        await createFile({
            userId,
            folderId,
            originalName: file.originalname,
            type: file.mimetype,
            size: file.size,
            url: file.path,
            publicId: file.public_id,
          });
  
        req.flash('success', 'File uploaded successfully.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to upload file.');
        res.redirect('/dashboard');
    }
  };