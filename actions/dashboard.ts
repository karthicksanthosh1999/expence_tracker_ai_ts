"use server";

import { accountInputType } from "@/app/types/accountTypes";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createAccount(data: accountInputType) {
  try {
    console.log("CreateAccount Input:", data);
    const { userId } = await auth();
    if (!userId) throw new Error("unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    console.log(user);
    if (!user) throw new Error("User not found");

    const account = await prisma.account.create({
      data: {
        name: user?.name ?? "N/A",
        type: data.type,
        balance: new Prisma.Decimal(data.balance ?? 0),
        isDefault: data.isDefault ?? false,
        userId: user?.id,
      },
    });

    return {
      success: true,
      data: account,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create account";
    return {
      success: false,
      message,
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
    if (!user) throw new Error("User not found");

    const account = await prisma.account.findMany({
      where: { userId: user?.id },
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
