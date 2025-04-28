// app/api/reminders/route.js
import dbConnect from '@/lib/dbConnect';
import Reminder from '@/models/Reminder';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Query can be extended with additional filters
    const query = { user: userId };
    
    // Optional date filtering
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const reminders = await Reminder.find(query).sort({ date: 1 });
    
    return NextResponse.json({ reminders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.date || !body.user) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newReminder = await Reminder.create(body);
    
    return NextResponse.json(
      { 
        message: 'Reminder created successfully',
        reminder: newReminder 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}