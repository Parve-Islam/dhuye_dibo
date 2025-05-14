// app/api/user/profile/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(controller)/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

// GET method to retrieve user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Ensure database connection is complete before querying
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email })
      .select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST method to update user profile
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Ensure database connection is complete before querying
    await dbConnect();
    
    const data = await request.json();
    const { name, profilePicture } = data;
    
    // Basic validation
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        name,
        profilePicture: profilePicture || undefined // Only update if provided
      },
      { new: true }
    ).select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user 
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}