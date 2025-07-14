const { createFolder, getUserFolders } = require('../models/folderModel');
const { getUserFiles, getSharedFiles } = require('../models/fileModel');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const folders = await getUserFolders(userId);
    const files = await getUserFiles(userId);
    const sharedFiles = await getSharedFiles(userId);

    res.render('dashboard/home', {
      folders,
      files,
      sharedFiles
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/');
  }
};

exports.postCreateFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name || !name.trim()) {
      req.flash('error', 'Folder name cannot be empty');
      return res.redirect('/dashboard');
    }
    await createFolder({ name: name.trim(), userId });
    req.flash('success', 'Folder created successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create folder.');
    res.redirect('/dashboard');
  }
};
