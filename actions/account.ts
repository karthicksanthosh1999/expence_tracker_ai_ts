"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

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

export const bulkDeleteTransactions = async (transactionsIds: string[]) => {
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

    const transactions = await prisma.transactions.findMany({
      where: {
        id: { in: transactionsIds },
        userId: user?.id,
      },
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;

      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    await prisma.$transaction(async (tx) => {
      await tx.transactions.deleteMany({
        where: {
          id: { in: transactionsIds },
          userId: user.id,
        },
      });

      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { succcess: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
