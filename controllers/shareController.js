const prisma = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const { parseDuration } = require('../utils/parseDuration');
const path = require('path');

exports.createShareLink = async (req, res) => {
  const { id } = req.params;
  const { duration } = req.body;

  try {
    const file = await prisma.file.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!file || file.userId !== req.user.id) {
      req.flash('error', 'File not found or unauthorized.');
      return res.redirect('/dashboard');
    }

    const expiresAt = duration ? parseDuration(duration) : null;

    const shareLink = await prisma.shareLink.create({
      data: {
        fileId: id,
        token: uuidv4(),
        expiresAt,
      },
    });

    req.flash('success', 'Share link created!');
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    return res.redirect('/dashboard');
  }
};

exports.accessSharedFile = async (req, res) => {
  const { token } = req.params;

  try {
    const link = await prisma.shareLink.findUnique({
      where: { token },
      include: { file: true },
    });

    if (!link) {
      return res.status(404).send('Invalid share link.');
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(403).send('Link expired.');
    }

    const filePath = path.join(__dirname, '../uploads', link.file.storedName);
    res.download(filePath, link.file.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
};
