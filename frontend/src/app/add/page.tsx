'use client';
import React, { useState, useEffect } from 'react';
import TaskForm from '../../components/TaskForm';
import Navigation from '../../components/Navigation';
import { useRouter } from 'next/navigation';
import { Task } from '../../types/task';
import Footer from '@/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aliza5-task-nest.hf.space';

const AddTaskPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add recurrence here
  const [task, setTask] = useState<Omit<Task, 'id' | 'created_at'>>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    recurrence: null,  
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Check for JWT token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  // Detect update mode and the fetch data
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('taskId');
    const token = sessionStorage.getItem('token');

    if (id && token) {
      setIsUpdate(true);
      setTaskId(id);

      fetch(`${API_BASE}/api/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch task');
          return res.json();
        })
        .then(data => {
          setTask({
            title: data.title,
            description: data.description || '',
            completed: data.completed,
            priority: data.priority || 'medium',
            recurrence: data.recurrence || null,   
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const url =
        isUpdate && taskId
          ? `${API_BASE}/api/v1/tasks/${taskId}`
          : `${API_BASE}/api/v1/tasks/`;

      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData), // taskData now includes recurrence
      });

      if (!res.ok) {
        throw new Error('Failed to save task');
      }

      router.push('/tasks');
    } catch (err) {
      setError('Failed to add/update task. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white">
      <Navigation />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isUpdate ? 'Update Task' : 'Add New Task'}
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <TaskForm initialData={task} onSubmit={handleTaskSubmit}  />

          {submitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700">Saving task...</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/tasks')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Tasks
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddTaskPage;
