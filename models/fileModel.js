const prisma = require('../prisma');

async function createFile({ userId, folderId, originalName, type, size, url, publicId }) {
  return await prisma.file.create({
    data: {
      userId,
      folderId,
      originalName,
      type,
      size,
      url,
      publicId
    }
  });
}

async function getUserFiles(userId) {
  return await prisma.file.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' }
  });
}

async function getSharedFiles(userId) {
  return await prisma.file.findMany({
    where: {
      shared: true,
      userId: {
        not: userId, // exclude current user
      },
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        }
      },
    },
    orderBy: {
      uploadedAt: 'desc',
    }
  });
}

module.exports = { createFile, getUserFiles, getSharedFiles };
