const prisma = require('../prisma');

async function createFile({ userId, folderId, originalName, storedName, mimeType, size }) {
  return await prisma.file.create({
    data: {
      userId,
      folderId,
      originalName,
      storedName,
      mimeType,
      size
    }
  });
}

async function getUserFiles(userId) {
  return await prisma.file.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' }
  });
}

module.exports = { createFile, getUserFiles };
