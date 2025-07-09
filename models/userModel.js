const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async ({ username, email, password, role = 'USER' }) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
      role,
    },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

module.exports = {
  createUser,
  findUserByEmail,
};
