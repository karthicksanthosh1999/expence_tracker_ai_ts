"use client";
import { updateDefaultAccount } from "@/actions/account";
import { IAccountListType } from "@/app/types/accountTypes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MouseEventHandler, useEffect } from "react";
import { toast } from "sonner";

const AccountCards = ({ account }: { account: IAccountListType }) => {
  const {
    data: updateDefaultData,
    error,
    fn: updateDefaultFn,
    loading: updateDefaultLoading,
  } = useFetch(updateDefaultAccount);

  const handleUpdateAccount: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    console.log(account);
    if (account?.isDefault) {
      toast.warning("You need atLeast-1 default account");
      return;
    }
    await updateDefaultFn(account?.id);
  };

  useEffect(() => {
    if (updateDefaultData?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updateDefaultLoading, updateDefaultData]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${account?.id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {account?.name ?? "N/A"}
          </CardTitle>
          <Switch
            id="isDefault"
            checked={account?.isDefault}
            disabled={updateDefaultLoading}
            onClick={handleUpdateAccount}
          />
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
