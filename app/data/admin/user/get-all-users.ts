import "server-only";
import { requireAdmin } from "../require-admin";
import { prisma } from "@/lib/db";

export const getTotalUsers = async () => {
  const { user } = await requireAdmin();

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: user.id,
      },
      role: {
        not: "admin",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export type GetTotalUsersType = Awaited<ReturnType<typeof getTotalUsers>>[0];
