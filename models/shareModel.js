// models/shareModel.js
const prisma = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const ms = require('ms');

exports.createShareLink = async (fileId, durationStr) => {
  const token = uuidv4();
  let expiresAt = null;

  if (durationStr) {
    const msDuration = ms(durationStr);
    if (!msDuration) throw new Error('Invalid duration format');
    expiresAt = new Date(Date.now() + msDuration);
  }

  return await prisma.shareLink.create({
    data: {
      fileId,
      token,
      expiresAt,
    }
  });
};

exports.getShareLinkByToken = async (token) => {
  return await prisma.shareLink.findUnique({
    where: { token },
    include: {
      file: true,
    }
  });
};
