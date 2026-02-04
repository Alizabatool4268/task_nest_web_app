'use client';

import React, { useState } from 'react';
import { Task } from '../types/task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'created_at'> | Task) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const isEditing = !!task;

  const [formData, setFormData] = useState<Omit<Task, 'id' | 'created_at'>>({
    title: task?.title || '',
    description: task?.description || '',
    completed: task?.completed || false,
    priority: task?.priority || '',
    tags: task?.tags || [],
    due_date: task?.due_date || '',
    recurring: task?.recurring || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'tags') {
      // Split tags by comma and trim whitespace
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({
        ...prev,
        [name]: tagsArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    if (formData.due_date && new Date(formData.due_date).toString() === 'Invalid Date') {
      newErrors.due_date = 'Please enter a valid date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // If editing, include the existing id and created_at
    if (isEditing && task) {
      const updatedTask: Task = {
        ...task,
        ...formData
      };
      onSubmit(updatedTask);
    } else {
      // If creating new task, exclude id and created_at (they'll be generated)
      const newTask: Omit<Task, 'id' | 'created_at'> = formData;
      onSubmit(newTask);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.due_date ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.due_date && (
            <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>
          )}
        </div>

        <div>
          <label htmlFor="recurring" className="block text-sm font-medium text-gray-700 mb-1">
            Recurring
          </label>
          <select
            id="recurring"
            name="recurring"
            value={formData.recurring}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Not recurring</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={(formData.tags || []).join(', ')}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="work, personal, urgent"
        />
      </div>

      {isEditing && (
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Completed</span>
          </label>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;