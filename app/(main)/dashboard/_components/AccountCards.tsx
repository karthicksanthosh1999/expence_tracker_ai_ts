import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AccountType } from "@/lib/generated/prisma";
import { Decimal } from "@prisma/client/runtime/client";

export interface IAccountType {
  id: string;
  name: string;
  type: AccountType;
  balance: Decimal;
  isDefault: boolean;
  userId: string;
}

const AccountCards = ({ balance, id, isDefault, name, type }: IAccountType) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name ?? "N/A"}</CardTitle>
        <Switch />
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default AccountCards;
