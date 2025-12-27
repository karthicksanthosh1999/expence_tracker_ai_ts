"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const updateDefaultAccount = async (accountId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User is not get");
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    await prisma.account.updateMany({
      where: {
        userId: user?.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const account = await prisma.account.update({
      where: {
        id: accountId,
        isDefault: false,
      },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: account,
    };
  } catch (error: unknown) {
    let message =
      error instanceof Error
        ? error.message
        : "Failed to switch the default account";
    return {
      success: false,
      message,
    };
  }
};

export const getAccountWithTransactions = async (accountId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User is not get");
  }
  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
      userId: user?.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    success: true,
    data: {
      ...account,
      balance: Number(account.balance),
      transactions: account.transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
    },
  };
};
