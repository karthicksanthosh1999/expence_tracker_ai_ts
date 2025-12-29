"use server";

import { TransactionStatus, TransactionsType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID: string = "66b35762-390c-41bc-9893-6e9a63388e2d";
const USER_ID: string = "04a5e08e-6d26-4eab-8e58-45bd0deb03f4";

interface CategoryConfig {
  name: string;
  range: [number, number];
}

const CATEGORIES: Record<TransactionsType, CategoryConfig[]> = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type: TransactionsType): {
  category: string;
  amount: number;
} {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    const transactions: any[] = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type: TransactionsType =
          Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${
            type === "INCOME" ? "Received" : "Paid for"
          } ${category}`,
          date,
          category,
          status: TransactionStatus.COMPLETED, // TYPE SAFE
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createAt: date,
          updateAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }
    }

    // Insert transactions in batches
    await prisma.$transaction(async (tx) => {
      await tx.transactions.deleteMany({ where: { accountId: ACCOUNT_ID } });
      await tx.transactions.createMany({ data: transactions });
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error: any) {
    console.error("Error seeding transactions:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
