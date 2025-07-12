const prisma = require('../prisma');

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

    const updatedFile = await prisma.file.update({
      where: { id },
      data: { shared: !file.shared },
    });

    req.flash('success', updatedFile.shared ? 'File shared!' : 'File unshared.');
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
