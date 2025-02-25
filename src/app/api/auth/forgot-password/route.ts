import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "If an account exists, an email will be sent." });
  }

  // Placeholder for sending email logic
  return NextResponse.json({ message: "Reset link sent if account exists" });
}
