const prisma = require('../prisma');
const cloudinary = require('../utils/cloudinary');
const https = require('https');

exports.downloadFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized.');
      return res.redirect('/dashboard');
    }

    https.get(file.url, (cloudRes) => {
      res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
      res.setHeader('Content-Type', cloudRes.headers['content-type']);
      cloudRes.pipe(res);
    }).on('error', (err) => {
      console.error('Cloudinary download error:', err);
      req.flash('error', 'Download failed.');
      res.redirect('/dashboard');
    });

  } catch (err) {
    console.error('Download error:', err);
    req.flash('error', 'Failed to download file.');
    res.redirect('/dashboard');
  }
};

exports.deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized.');
      return res.redirect('/dashboard');
    }

    if (file.publicId) {
      await cloudinary.uploader.destroy(file.publicId);
    }

    await prisma.file.delete({ where: { id: fileId } });

    req.flash('success', 'File deleted.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Delete file error:', err);
    req.flash('error', 'Failed to delete file.');
    res.redirect('/dashboard');
  }
};


exports.toggleShare = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized.');
      return res.redirect('/dashboard');
    }

    const isNowShared = !file.shared;

    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        shared: isNowShared,
        visibility: isNowShared ? 'PUBLIC' : 'PRIVATE',
      },
    });

    req.flash('success', isNowShared ? 'File shared!' : 'File unshared.');
    res.redirect(`/dashboard/file/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update share status.');
    res.redirect('/dashboard');
  }
};


exports.getFile = async (req, res) => {
  const id = req.params.id;
  const file = await prisma.file.findUnique( {where: {id} } )
  res.render('dashboard/fileDetails', {
    file
  });
}

exports.getSharedFile = async (req, res) => {
  const id = req.params.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          }
        }
      }
    });

    if (!file || !file.shared) {
      req.flash('error', 'This file is not shared.');
      return res.redirect('/dashboard');
    }

    res.render('dashboard/sharedFile', { file });
    
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/dashboard');
  }
}

