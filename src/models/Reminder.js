// models/reminderModel.js
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A reminder must have a title'],
    trim: true,
    maxlength: [100, 'A reminder title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'A reminder description cannot exceed 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'A reminder must have a date']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A reminder must belong to a user']
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create indexes for efficient querying
reminderSchema.index({ user: 1, date: 1 });
reminderSchema.index({ date: 1, notificationSent: 1 });

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);