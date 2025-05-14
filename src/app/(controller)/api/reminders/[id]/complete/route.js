// app/api/reminders/[id]/complete/route.js
import { NextResponse } from 'next/server';
import Reminder from '@/models/Reminder';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const isCompleted = body.isCompleted === undefined ? true : !!body.isCompleted;
    
    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true, runValidators: true }
    );
    
    if (!updatedReminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: `Reminder marked as ${isCompleted ? 'completed' : 'incomplete'}`,
        reminder: updatedReminder 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating reminder completion status:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder completion status' },
      { status: 500 }
    );
  }
}