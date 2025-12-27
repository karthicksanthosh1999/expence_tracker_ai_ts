"use client";

import { getAccountWithTransactions } from "@/actions/account";
import { AccountType, Transactions } from "@/lib/generated/prisma";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface IAccount {
  name: string;
  type: AccountType;
  balance: number;
  isDefault: boolean;
  transactions: {
    id: string;
    type: Transactions["type"];
    amount: number;
    description: string | null;
    date: Date;
    // FIXED FIELDS
    category: string | null; // updated
    receiptUrl: string | null; // added
    isRecurring: boolean; // added

    accountId: string;
    createdAt?: Date;
    updateAt?: Date;
  }[];
  _count: {
    transactions: number;
  };
}

const AccountPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState<IAccount>({
    balance: 0,
    isDefault: false,
    name: "",
    transactions: [],
    type: "CURRENT",
    _count: { transactions: 0 },
  });

  useEffect(() => {
    if (!id) return notFound();
    const fetch = async () => {
      try {
        const res = await getAccountWithTransactions(id as string);
        if (!res?.data) return notFound();
        setAccount(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="space-y-8 px-5 flex gap-4 items-end justify-between">
      <div>
        <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
          {account?.name}
        </h1>
        <p className="text-muted-foreground">{account?.type}</p>
      </div>
      <div className="text-right pb-2">
        <div className="text-xl sm:text-2xl font-bold">{account?.balance}</div>
        <p className="text-sm text-muted-foreground">
          {account?._count?.transactions}
        </p>
      </div>

      {/* CHART SECTION  */}
      {/* TABLE SECTION */}
    </div>
  );
};

export default AccountPage;
