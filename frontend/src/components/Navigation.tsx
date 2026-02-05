'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/auth/login'; // redirect to login page
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-200"
            >
              Todo App
            </Link>
          </div>

          <div className="flex space-x-4 items-center">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/tasks"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/tasks')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Tasks
            </Link>
            <Link
              href="/add"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/add')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Add Task
            </Link>

            {/* Show Logout ONLY if user is logged in */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-600 hover:bg-gray-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;