import prisma from "../lib/prisma.js";

export async function findUserByEmail(email) {
  return await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      phoneNumber: true,
      birthDate: true,
      adress: true,
      userType: true,
      password: true
    }
  });
}
