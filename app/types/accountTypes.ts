import { AccountType } from "@/lib/generated/prisma";
import { Decimal } from "@prisma/client/runtime/client";

export interface accountInputType {
  name: string;
  type: AccountType;
  balance: number | string | Decimal;
  isDefault?: boolean;
}

export interface IAccountListType {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  isDefault: boolean;
  userId: string;
  _count: {
    transactions: number;
  };
}
