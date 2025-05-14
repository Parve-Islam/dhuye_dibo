// app/api/reminders/[id]/route.js
import { NextResponse } from 'next/server';
import Reminder from '@/models/Reminder';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get a specific reminder
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const reminder = await Reminder.findById(id);
    
    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ reminder }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminder' },
      { status: 500 }
    );
  }
}

// Update a specific reminder
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const updatedReminder = await Reminder.findByIdAndUpdate(
      id,
      body,
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
        message: 'Reminder updated successfully',
        reminder: updatedReminder 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// Delete a specific reminder
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const deletedReminder = await Reminder.findByIdAndDelete(id);
    
    if (!deletedReminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Reminder deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}