// app/api/upload/image/route.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get("image");
    
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload a valid image (JPEG, PNG, or GIF)" }, { status: 400 });
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
    }
    
    // Generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename with original extension
    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    
    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Write the file to the uploads directory
      await writeFile(path.join(uploadDir, fileName), buffer);
      
      // Return the URL path to the uploaded image
      const imageUrl = `/uploads/${fileName}`;
      
      return NextResponse.json({ 
        message: "Image uploaded successfully", 
        imageUrl 
      });
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json({ error: "Failed to save the file: " + error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 });
  }
}