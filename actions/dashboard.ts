"use server";

import { AccountType } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  isDefault?: boolean;
  userId: string;
}

export async function createAccount(data: CreateAccountInput) {
  try {
    console.log("CreateAccount Input:", data);
    const { userId } = await auth();
    if (!userId) throw new Error("unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const account = await prisma.account.create({
      data: {
        name: user?.name ?? "N/A",
        type: data.type,
        balance: new Prisma.Decimal(data.balance ?? 0),
        isDefault: data.isDefault ?? false,
        userId: userId,
      },
    });

    return {
      success: true,
      data: account,
    };
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return {
      success: false,
      message: error.message ?? "Failed to create account",
    };
  }
}

export async function fetchAccountList() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    console.log({ user, userId });
    if (!user) throw new Error("User not found");

    const account = await prisma.account.findMany({
      where: { userId },
      orderBy: { updateAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return {
      success: true,
      data: account,
    };
  } catch (error) {
    console.error("Create Account Error:", error);
    return {
      success: false,
      message: "Failed to create account",
    };
  }
}
