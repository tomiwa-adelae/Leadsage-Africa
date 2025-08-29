import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export const getPaymentMethods = async () => {
  const { user } = await requireUser();

  const methods = await prisma.paymentMethod.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      cardType: true,
      cardNumber: true,
      expiryDate: true,
      nameOnCard: true,
    },
  });

  return methods;
};

export type GetPaymentMethodsType = Awaited<
  ReturnType<typeof getPaymentMethods>
>[0];
