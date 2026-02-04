"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/auth';
import apiClient from '../../services/api';


interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: string;
  tags?: string;
  due_date?: string;
  recurring: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ---------------------------
  // JWT CHECK — FIXED
  // ---------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await apiClient.tasks.getAll();
        setTasks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ---------------------------
  // Create Task
  // ---------------------------
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await apiClient.tasks.create({
        ...newTask,
        completed: false,
        recurring: false,
      });

      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", priority: "medium" });
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    }
  };

  // ---------------------------
  // Update Task
  // ---------------------------
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTask) return;

    try {
      const response = await apiClient.tasks.update(
        editingTask.id,
        editingTask
      );

      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        )
      );

      setEditingTask(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  // ---------------------------
  // Delete Task
  // ---------------------------
  const handleDeleteTask = async (id: number) => {
    try {
      await apiClient.tasks.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  // ---------------------------
  // Toggle Complete
  // ---------------------------
  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const response = await apiClient.tasks.complete(id, !completed);
      setTasks(
        tasks.map((task) =>
          task.id === id ? response.data : task
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update task status");
    }
  };

  // ---------------------------
  // UI LOADING STATE
  // ---------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          My Tasks
        </h1>

        {error && (
          <div className="bg-red-50 p-4 mb-4 rounded-md text-red-700">{error}</div>
        )}

        {/* Create Task Form */}
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              required
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="bg-white shadow rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <li className="p-6 text-gray-500">No tasks found.</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleToggleComplete(task.id, task.completed)
                        }
                        className="h-4 w-4"
                      />
                      <span className="ml-3 text-sm">
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
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
  );
};

export default TasksPage;


// interface Task {
//   id: number;
//   title: string;
//   description?: string;
//   completed: boolean;
//   priority: string;
//   tags?: string;
//   due_date?: string;
//   recurring: boolean;
//   created_at: string;
//   updated_at: string;
//   user_id: string;
// }

// const TasksPage = () => {
//   const [session, setSession] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [newTask, setNewTask] = useState({
//     title: '',
//     description: '',
//     priority: 'medium',
//   });
//   const [editingTask, setEditingTask] = useState<Task | null>(null);

//   // Fetch session and tasks
//   useEffect(() => {
//     const checkSessionAndFetchTasks = async () => {
//       try {
//         // Check if user is authenticated by making a session request
//         const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:8000'}/api/auth/session`, {
//           credentials: 'include'
//         });

//         if (sessionResponse.ok) {
//           const sessionData = await sessionResponse.json();
//           setSession(sessionData);

//           // Now fetch tasks if session is valid
//           setLoading(true);
//           const response = await apiClient.tasks.getAll();
//           setTasks(response.data);
//         } else {
//           // If not authenticated, redirect to login
//           window.location.href = '/auth/login';
//         }
//       } catch (err) {
//         setError('Failed to load tasks or verify authentication');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//         setLoading(false);
//       }
//     };

//     checkSessionAndFetchTasks();
//   }, []);

//   // Create task
//   const handleCreateTask = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!session?.user?.id) {
//       setError('User not authenticated');
//       return;
//     }

//     try {
//       const response = await apiClient.tasks.create({
//         ...newTask,
//         user_id: session.user.id,
//         completed: false,
//         recurring: false,
//       });

//       setTasks([...tasks, response.data]);
//       setNewTask({ title: '', description: '', priority: 'medium' });
//     } catch (err) {
//       setError('Failed to create task');
//       console.error(err);
//     }
//   };

//   // Update task
//   const handleUpdateTask = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!editingTask) return;

//     try {
//       const response = await apiClient.tasks.update(editingTask.id, editingTask);
//       setTasks(tasks.map(task =>
//         task.id === editingTask.id ? response.data : task
//       ));
//       setEditingTask(null);
//     } catch (err) {
//       setError('Failed to update task');
//       console.error(err);
//     }
//   };

//   // Delete task
//   const handleDeleteTask = async (id: number) => {
//     try {
//       await apiClient.tasks.delete(id);
//       setTasks(tasks.filter(task => task.id !== id));
//     } catch (err) {
//       setError('Failed to delete task');
//       console.error(err);
//     }
//   };

//   // Toggle task completion
//   const handleToggleComplete = async (id: number, completed: boolean) => {
//     try {
//       const response = await apiClient.tasks.complete(id, !completed);
//       setTasks(tasks.map(task =>
//         task.id === id ? response.data : task
//       ));
//     } catch (err) {
//       setError('Failed to update task status');
//       console.error(err);
//     }
//   };

//   if (!session || isLoading) {
//     if (isLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50">
//           <div className="text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//             <p className="mt-2 text-gray-600">Loading...</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800">Please log in to access tasks</h2>
//           <a href="/auth/login" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
//             Go to Login
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900">My Tasks</h1>
//           <p className="mt-2 text-gray-600">Manage your personal tasks</p>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4 mb-4">
//             <div className="text-sm text-red-700">{error}</div>
//           </div>
//         )}

//         {/* Create Task Form */}
//         <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
//           <div className="px-4 py-5 sm:px-6">
//             <h2 className="text-lg leading-6 font-medium text-gray-900">Create New Task</h2>
//           </div>
//           <div className="px-4 py-5 sm:p-6">
//             <form onSubmit={handleCreateTask} className="space-y-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   value={newTask.description}
//                   onChange={(e) => setNewTask({...newTask, description: e.target.value})}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
//                   Priority
//                 </label>
//                 <select
//                   id="priority"
//                   value={newTask.priority}
//                   onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
//                   className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Create Task
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Task List */}
//         {loading ? (
//           <div className="text-center py-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
//             <p className="mt-2 text-gray-600">Loading tasks...</p>
//           </div>
//         ) : (
//           <div className="bg-white shadow overflow-hidden sm:rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {tasks.length === 0 ? (
//                 <li className="px-4 py-5 sm:px-6">
//                   <p className="text-gray-500">No tasks found. Create your first task!</p>
//                 </li>
//               ) : (
//                 tasks.map((task) => (
//                   <li key={task.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
//                     {editingTask?.id === task.id ? (
//                       // Edit form
//                       <form onSubmit={handleUpdateTask} className="space-y-2">
//                         <input
//                           type="text"
//                           value={editingTask.title}
//                           onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
//                           className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
//                         />
//                         <textarea
//                           value={editingTask.description || ''}
//                           onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
//                           className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
//                         />
//                         <div className="flex space-x-2">
//                           <button
//                             type="submit"
//                             className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
//                           >
//                             Save
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setEditingTask(null)}
//                             className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </form>
//                     ) : (
//                       // Task display
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             checked={task.completed}
//                             onChange={() => handleToggleComplete(task.id, task.completed)}
//                             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                           />
//                           <div className="ml-3 min-w-0">
//                             <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
//                               {task.title}
//                             </p>
//                             {task.description && (
//                               <p className="text-sm text-gray-500 truncate">{task.description}</p>
//                             )}
//                             <div className="mt-1 flex items-center text-xs text-gray-500">
//                               <span className={`px-2 py-0.5 rounded-full ${
//                                 task.priority === 'high' ? 'bg-red-100 text-red-800' :
//                                 task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                                 'bg-green-100 text-green-800'
//                               }`}>
//                                 {task.priority}
//                               </span>
//                               <span className="ml-2">
//                                 {new Date(task.created_at).toLocaleDateString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => setEditingTask(task)}
//                             className="inline-flex items-center px-2.5 py-0.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTask(task.id)}
//                             className="inline-flex items-center px-2.5 py-0.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 ))
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TasksPage;