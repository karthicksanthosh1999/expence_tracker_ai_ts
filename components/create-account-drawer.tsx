"use client";
import React, { ReactNode, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, accountSchemaType } from "@/app/lib/schema";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const CreateAccountDrawer = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const onSubmit = (data: accountSchemaType) => {
    console.log(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="name">Account Name</label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2 w-full">
              <label htmlFor="type">Account Name</label>
              <Select
                onValueChange={(value: "CURRENT" | "SAVINGS") =>
                  setValue("type", value)
                }
                defaultValue={watch("type")}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="balance"> Balance</label>
              <Input
                id="balance"
                type="number"
                step={"0.01"}
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>
            {/* SWITCH */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0 5">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer">
                  Set a Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}></Switch>
            </div>

            {/* BUTTONS */}
            <div>
              <DrawerClose>
                <Button type="button" variant={"outline"} className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
