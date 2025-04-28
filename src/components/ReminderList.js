// components/ReminderList.js
import { useState } from 'react';
import Link from 'next/link';

export default function ReminderList({ reminders, onComplete, onDelete }) {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'HIGH':
        return 'bg-red-100 border-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 border-yellow-300';
      case 'LOW':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div 
          key={reminder._id}
          className={`border rounded p-4 ${reminder.isCompleted ? 'opacity-60' : ''} ${getPriorityClass(reminder.priority)}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={reminder.isCompleted}
                  onChange={() => onComplete(reminder._id, !reminder.isCompleted)}
                  className="h-5 w-5 mr-3"
                />
                <h3 className={`text-xl font-semibold ${reminder.isCompleted ? 'line-through text-gray-500' : ''}`}>
                  {reminder.title}
                </h3>
              </div>
              
              {reminder.description && (
                <p className="mt-2 text-gray-700">{reminder.description}</p>
              )}
              
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Due: </span>{formatDate(reminder.date)}
              </div>
              
              <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold rounded-full bg-gray-200">
                {reminder.priority}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Link 
                href={`/reminder/edit/${reminder._id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(reminder._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

