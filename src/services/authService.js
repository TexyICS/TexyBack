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
