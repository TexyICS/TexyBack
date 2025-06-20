import prisma from "../lib/prisma.js";

export async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: { email },
    select: {
      user_id: true,
      email: true,
      username: true,
      phone_number: true,
      is_active: true,
      password: true
    }
  });
}

export async function createUser({ username, email, phone_number, password }) {
  return await prisma.users.create({
    data: {
      username,
      email,
      phone_number,
      password,
      is_active: true
    },
    select: {
      user_id: true,
      email: true,
      username: true,
      phone_number: true,
      is_active: true
    }
  });
}

export async function findUserById(userId) {
  return await prisma.users.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      email: true,
      username: true,
      phone_number: true,
      is_active: true,
      created_at: true
    }
  });
}