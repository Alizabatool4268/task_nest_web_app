'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Todo App</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your tasks efficiently with our simple and intuitive interface
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/tasks"
              className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-base sm:text-lg"
            >
              View Tasks
            </Link>
            <Link
              href="/add"
              className="px-5 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200 text-base sm:text-lg"
            >
              Add New Task
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 border border-gray-200 rounded-lg min-h-[120px]">
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left">Task Management</h3>
              <p className="text-gray-600 text-sm text-center sm:text-left">
                Add, edit, complete, and delete tasks with ease
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg min-h-[120px]">
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left">Priority Tracking</h3>
              <p className="text-gray-600 text-sm text-center sm:text-left">
                Set priorities to focus on what matters most
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg min-h-[120px]">
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left">Responsive Design</h3>
              <p className="text-gray-600 text-sm text-center sm:text-left">
                Access your tasks from any device, anywhere
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Your tasks are securely stored in your browser's LocalStorage</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;