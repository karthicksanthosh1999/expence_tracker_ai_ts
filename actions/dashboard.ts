"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeAccount = (account: Prisma.AccountWhereInput) => {
  return {
    ...account,
    balance: account.balance?.toNumber(),
  };
};

export const createAccount = async ({
  data,
}: {
  data: Prisma.AccountCreateInput;
}) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // ✅ Proper balance parsing
    let balanceFloat: number;

    if (typeof data.balance === "string") {
      balanceFloat = parseFloat(data.balance);
    } else if (typeof data.balance === "number") {
      balanceFloat = data.balance;
    } else {
      throw new Error("Balance is required");
    }

    if (Number.isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccounts = await prisma.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault ?? false;

    if (shouldBeDefault) {
      await prisma.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await prisma.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeAccount(account),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};
