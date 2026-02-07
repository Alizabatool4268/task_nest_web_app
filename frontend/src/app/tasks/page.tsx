'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../services/api';
import { Task } from '../../types/task';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Tasks API client
const tasksAPI = {
  getAll: (token: string) =>
    apiClient.get('/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    }),

  complete: (id: number, completed: boolean, token: string) =>
    apiClient.put(`/tasks/${id}`, { completed }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  delete: (id: number, token: string) =>
    apiClient.delete(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await tasksAPI.getAll(token);
        setTasks(res.data);
      } catch (err) {
        setError('Failed to load tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, router]);

// Toggle completion
const handleToggleComplete = async (task: Task) => {
  if (!token) return;
  try {
    const res = await tasksAPI.complete(
      Number(task.id),
      !task.completed,
      token
    );

    // Update frontend state
    setTasks(tasks.map(t => t.id === task.id ? res.data : t));
  } catch (err) {
    setError('Failed to update task status');
    console.error(err);
  }
};

  // Delete task
  const handleDeleteTask = async (id: number) => {
    if (!token) return;
    try {
      await tasksAPI.delete(id, token);
      setTasks(prev => prev.filter(task => Number(task.id) !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Edit task
  const handleEditTask = (task: Task) => {
    router.push(`/add?taskId=${task.id}`);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700">Please log in to view your tasks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <section>
    <Navigation />
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-gray-600">Manage your personal tasks</p>
          <p className='mt-2 text-gray-600'>While editing tasks, you can update their title, description, recurrence, status,  priority, and due date. make sure to send all fields</p>
          <Link href={"/add"} className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Form
          </Link>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white  shadow sm:rounded-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <li className="px-4 py-5 sm:px-6 ">
                <p className="text-gray-500">No tasks found. Add a new task!</p>
              </li>
            ) : (
              tasks.map(task => (
                <li
                key={task.id}
                className="px-4 py-5 sm:px-6 hover:bg-gray-50 flex justify-between items-center md:flex-row md:justify-between md:items-center xs:flex-col xs:items-start "
                >
                  <div className="flex items-center">
                    {/* Completion Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />

                    {/* Task Content */}
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="text-sm text-gray-500 truncate">{task.description}</p>
                      )}

                      {/* Priority + Due Date */}
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded-full ${
                          task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                          }`}>
                          {task.priority}
                        </span>

                        {task.due_date && (
                          <span className="ml-2">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Recurrence */}
                      {task.recurrence && (
                        <div className="mt-1 text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${
                            task.recurrence === "monthly"
                            ? "bg-blue-100 text-blue-800"
                            : task.recurrence === "weekly"
                            ? "bg-teal-100 text-teal-900"
                            : "bg-purple-100 text-purple-900"
                            }`}>
                            {task.recurrence}
                          </span>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit + Delete */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="px-2.5 py-0.5 border text-xs rounded bg-white"
                      >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTask(Number(task.id))}
                      className="px-2.5 py-0.5 text-xs text-white bg-red-600 rounded"
                      >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </div>
    <Footer/>
    </section> 
  );
};

export default TasksPage;