const crypto = require('crypto');

// Generate token helper
function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Route to render share form for a folder
router.get('/folder/:id/share', ensureAuthenticated, async (req, res) => {
  const folderId = req.params.id;
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true }
    });
    if (!folder) return res.status(404).send('Folder not found');
    res.render('dashboard/shareFolder', { folder });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST: Create share links for all files in folder
router.post('/folder/:id/share', ensureAuthenticated, async (req, res) => {
  const folderId = req.params.id;
  const { durationDays } = req.body;
  const expiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true }
    });
    if (!folder) return res.status(404).send('Folder not found');

    for (const file of folder.files) {
      const token = generateToken();
      await prisma.shareLink.create({
        data: {
          fileId: file.id,
          token,
          expiresAt,
        }
      });
    }
    req.flash('success', `Folder shared for ${durationDays} day(s). Share links created.`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create share links');
    res.redirect('/dashboard');
  }
});

// Public route to access a shared file by token
router.get('/share/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: { file: true }
    });
    if (!shareLink) return res.status(404).send('Invalid share link');
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return res.status(410).send('Share link expired');
    }

    // Send file details page (without authentication)
    res.render('dashboard/sharedFile', { file: shareLink.file });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Public route to download shared file
router.get('/share/:token/download', async (req, res) => {
  const { token } = req.params;
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: { file: true }
    });
    if (!shareLink) return res.status(404).send('Invalid share link');
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return res.status(410).send('Share link expired');
    }

    const filePath = path.join(__dirname, '../uploads', shareLink.file.storedName);
    res.download(filePath, shareLink.file.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).send('Download error');
  }
});
