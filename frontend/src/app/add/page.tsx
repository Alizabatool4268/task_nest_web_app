'use client';

import React, { useState } from 'react';
import TaskForm from '../../components/TaskForm';
import Navigation from '../../components/Navigation';
import Link from 'next/link';
import { Task } from '../../types/task';
import { addTask } from '../../utils/storage';

const AddTaskPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    setSubmitting(true);
    setError(null);

    try {
      const newTask = addTask(taskData);
      window.location.href = '/tasks';
    } catch (err) {
      setError('Failed to add task. Please try again.');
      setSubmitting(false);
      console.error('Error adding task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Task</h1>
            <Link
              href="/tasks"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Tasks
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <TaskForm onSubmit={handleTaskSubmit} />

          {submitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700">Saving task...</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; // <-- THIS was missing!

export default AddTaskPage;

// 'use client';

// import React, { useState } from 'react';
// import TaskForm from '../../components/TaskForm';
// import Navigation from '../../components/Navigation';
// import Link from 'next/link';
// import { Task } from '../../types/task';
// import { addTask } from '../../utils/storage';

// const AddTaskPage = () => {
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'created_at'>) => {
//     setSubmitting(true);
//     setError(null);

//     try {
//       const newTask = addTask(taskData);
//       // Redirect to tasks page after successful submission
//       window.location.href = '/tasks';
//     } catch (err) {
//       setError('Failed to add task. Please try again.');
//       setSubmitting(false);
//       console.error('Error adding task:', err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation />
//       <div className="py-12">
//         <div className="container mx-auto px-4 max-w-4xl">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Add New Task</h1>
//           <Link
//             href="/tasks"
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//           >
//             Back to Tasks
//           </Link>
//         </div>

//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         <TaskForm
//           onSubmit={handleTaskSubmit}
//         />

//         {submitting && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg flex flex-col items-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//               <p className="text-gray-700">Saving task...</p>
//             </div>
//           </div>
//         )}

//         <div className="mt-6 text-center">
//           <Link
//             href="/"
//             className="text-blue-600 hover:text-blue-800 font-medium"
//           >
//             ← Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTaskPage