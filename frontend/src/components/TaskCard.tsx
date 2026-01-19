'use client';

import React from 'react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  return (
    <div className={`p-4 mb-3 rounded-lg shadow-md border-l-4 ${
      task.completed
        ? 'border-green-500 bg-gray-50'
        : 'border-blue-500 bg-white'
    }`}>
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="mt-1 sm:mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-lg font-medium break-words ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm sm:text-base text-gray-600 break-words ${
              task.completed ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {task.priority && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                task.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            )}
            {task.due_date && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Created: {new Date(task.created_at).toLocaleString()}
          </div>
        </div>
        <div className="flex space-x-2 self-start sm:self-center">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 flex-shrink-0"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;