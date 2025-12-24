import { IAccountListType } from "@/app/types/accountTypes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const AccountCards = ({ account }: { account: IAccountListType }) => {
  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${account?.id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {account?.name ?? "N/A"}
          </CardTitle>
          <Switch checked={account?.isDefault} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{account?.balance}</div>
          <p className="text-xs text-muted-foreground">
            {account?.type.charAt(0) + account?.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-red-500" />
            Income
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCards;
