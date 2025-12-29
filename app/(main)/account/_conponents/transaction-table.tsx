"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import { Transactions } from "@/lib/generated/prisma";
import { RecurringInterval } from "@/lib/generated/prisma/enums";
import { format } from "date-fns";
import { Clock, MoreHorizontal, RefreshCcw } from "lucide-react";

type TTransaction = {
  id: string;
  type: Transactions["type"];
  amount: number;
  description: string | null;
  date: Date;
  nextRecurringDate: Date;
  category: string | null;
  receiptUrl: string | null;
  recurringInterval: RecurringInterval;
  isRecurring: boolean;
  accountId: string;
  createdAt?: Date;
  updateAt?: Date;
};

type TProps = {
  transaction: TTransaction[];
};
const TransactionTable = ({ transaction }: TProps) => {
  const filterAndSortedTransactions = transaction;

  const handleSort = (params: string) => {};

  const RECURRING_INTERVALS = {
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12.5">
                <Checkbox className="cursor-pointer" />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}>
                <div className="flex items-center">Date</div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}>
                <div className="flex items-center ">Category</div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">Amount</div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-12.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground">
                  No Transaction Found
                </TableCell>
              </TableRow>
            ) : (
              filterAndSortedTransactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox className="cursor-pointer" />
                  </TableCell>
                  <TableCell>{format(new Date(item.date), "PP")}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[item.category ?? ""],
                      }}
                      className="px-2 py-1 rounded text-white text-sm">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-end font-semibold"
                    style={{
                      color: item.type === "EXPENSE" ? "red" : "green",
                    }}>
                    {item.type === "EXPENSE" ? "-" : "+"}₹
                    {item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {item.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={"outline"} className="gap-1">
                              <RefreshCcw className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200" />
                              {RECURRING_INTERVALS[item.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(item?.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant={"outline"} className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
