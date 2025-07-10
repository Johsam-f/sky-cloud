const prisma = require('../prisma');

async function createFolder({ name, userId }) {
  return await prisma.folder.create({
    data: { name, userId }
  });
}

async function getUserFolders(userId) {
  return await prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

module.exports = { createFolder, getUserFolders };
