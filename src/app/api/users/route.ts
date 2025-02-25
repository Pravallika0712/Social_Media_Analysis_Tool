import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "@/lib/models/User";

// Handle GET requests
export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// Handle POST requests
export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        await connectToDatabase();
        const newUser = new User({ name, email, password });
        await newUser.save();
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
