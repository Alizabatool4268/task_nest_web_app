'use client';

import React, { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import Navigation from '../../components/Navigation';
import { Task } from '../../types/task';
import { getTasks, updateTask, deleteTask, toggleComplete } from '../../utils/storage';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState<string | null>(null); // Track which operation is loading

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'created_at'> | Task) => {
    if ('id' in taskData && taskData.id) {
      // Editing existing task
      setOperationLoading('update');
      try {
        const updatedTask = updateTask(taskData as Task);
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
      } finally {
        setOperationLoading(null);
      }
    } else {
      // This shouldn't happen on the tasks page since we're only editing here
      // But if we were to add a new task from this page, we'd need to handle it
    }
  };

  const handleToggleComplete = (id: string) => {
    setOperationLoading(`toggle-${id}`);
    try {
      const updatedTask = toggleComplete(id);
      setTasks(prev => prev.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error toggling task completion:', error);
      alert('Failed to update task completion status');
    } finally {
      setOperationLoading(null);
    }
  };

  const handleDelete = (id: string) => {
    setOperationLoading(`delete-${id}`);
    try {
      deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setOperationLoading(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Tasks</h1>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 flex-1 sm:flex-none min-w-[100px]"
            >
              Home
            </button>
            <button
              onClick={() => window.location.href = '/add'}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex-1 sm:flex-none min-w-[100px]"
            >
              Add Task
            </button>
          </div>
        </div>

        {editingTask ? (
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-700">
              Showing <span className="font-semibold">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''}
              {tasks.length > 0 && (
                <>
                  {' '}(<span className="text-green-600">{tasks.filter(t => t.completed).length}</span> completed,{' '}
                  <span className="text-blue-600">{tasks.filter(t => !t.completed).length}</span> pending)
                </>
              )}
            </p>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
            <div className="mt-6">
              <a
                href="/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add your first task
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {tasks
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
          </div>
        )}
      </div>

      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-gray-700">
              {operationLoading.startsWith('toggle') ? 'Updating...' :
               operationLoading.startsWith('delete') ? 'Deleting...' : 'Saving...'}
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TasksPage;