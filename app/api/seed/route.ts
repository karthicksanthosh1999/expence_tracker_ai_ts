import { seedTransactions } from "@/actions/seed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const result = await seedTransactions();
  return NextResponse.json(result);
}
