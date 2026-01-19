import { Task } from '../types/task';

const TASKS_KEY = 'todo-tasks';
const TASKS_BACKUP_KEY = 'todo-tasks-backup';

export const getTasks = (): Task[] => {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined' || !window.localStorage) {
      console.error('localStorage is not available');
      return [];
    }

    const tasksJson = localStorage.getItem(TASKS_KEY);
    if (!tasksJson) return [];

    let tasks;
    try {
      tasks = JSON.parse(tasksJson);
    } catch (parseError) {
      console.error('Error parsing tasks from localStorage - data may be corrupted:', parseError);
      // Try to restore from backup
      return restoreFromBackup();
    }

    // Ensure tasks is an array
    if (!Array.isArray(tasks)) {
      console.error('Tasks data in localStorage is not an array');
      // Try to restore from backup
      return restoreFromBackup();
    }

    // Validate tasks structure and filter out invalid entries
    const validTasks = tasks.filter((task: any) => {
      // Basic type validation
      const isValid = typeof task.id === 'string' &&
                     typeof task.title === 'string' &&
                     typeof task.completed === 'boolean' &&
                     typeof task.created_at === 'string';

      // Additional validation for optional fields
      if (isValid && task.priority !== undefined && typeof task.priority !== 'string') {
        console.warn('Invalid priority value for task:', task.id);
        return false;
      }

      if (isValid && task.description !== undefined && typeof task.description !== 'string') {
        console.warn('Invalid description value for task:', task.id);
        return false;
      }

      if (isValid && task.due_date !== undefined && typeof task.due_date !== 'string') {
        console.warn('Invalid due_date value for task:', task.id);
        return false;
      }

      if (isValid && task.recurring !== undefined && typeof task.recurring !== 'string') {
        console.warn('Invalid recurring value for task:', task.id);
        return false;
      }

      if (isValid && task.tags !== undefined && !Array.isArray(task.tags)) {
        console.warn('Invalid tags value for task:', task.id);
        return false;
      }

      // If tags exist, verify they're all strings
      if (isValid && Array.isArray(task.tags) && task.tags.some((tag: any) => typeof tag !== 'string')) {
        console.warn('Invalid tag value in tags array for task:', task.id);
        return false;
      }

      return isValid;
    });

    // If we filtered out many invalid tasks, warn the user
    if (validTasks.length < tasks.length) {
      console.warn(`Filtered out ${tasks.length - validTasks.length} invalid tasks from storage`);
      // Save the cleaned tasks back to storage
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(validTasks));
      } catch (saveError) {
        console.error('Error saving cleaned tasks back to localStorage:', saveError);
      }
    }

    return validTasks;
  } catch (error) {
    console.error('Unexpected error loading tasks from localStorage:', error);
    return [];
  }
};

// Function to check if there's enough space in localStorage
const checkStorageQuota = (data: string): void => {
  try {
    // Estimate the available space
    const estimate = navigator.storage && navigator.storage.estimate ?
      navigator.storage.estimate() : null;

    if (estimate) {
      estimate.then(quotas => {
        if (quotas.quota && quotas.usage) {
          const availableSpace = quotas.quota - quotas.usage;
          const requiredSpace = new Blob([data]).size;

          if (requiredSpace > availableSpace * 0.1) { // Use 10% of available space as threshold
            console.warn('LocalStorage space is running low');
          }
        }
      }).catch(() => {
        // Ignore errors from storage estimation API
      });
    }

    // Also do a simple test by trying to save and restore
    const testKey = '__storage_test__';
    const testValue = 'test';
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    if (retrieved !== testValue) {
      throw new Error('LocalStorage may be full or unavailable');
    }
  } catch (error) {
    if ((error as DOMException).name === 'QuotaExceededError') {
      throw new Error('LocalStorage quota exceeded');
    }
    // For other errors, continue with the operation but log the issue
    console.warn('Could not verify localStorage availability:', error);
  }
};

// Function to create a backup of tasks
const backupTasks = (tasks: Task[]): void => {
  try {
    // Store a backup copy of tasks
    localStorage.setItem(TASKS_BACKUP_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error creating backup of tasks:', error);
    // Backup failure shouldn't stop the main operation
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    // Check if localStorage is available
    if (typeof Storage === 'undefined' || !window.localStorage) {
      throw new Error('localStorage is not available');
    }

    const tasksJson = JSON.stringify(tasks);
    checkStorageQuota(tasksJson); // Check storage quota before saving

    localStorage.setItem(TASKS_KEY, tasksJson);

    // Create a backup after successful save
    backupTasks(tasks);
  } catch (error) {
    if ((error as DOMException).name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded while saving tasks');
      throw new Error('Not enough storage space to save tasks');
    }
    console.error('Error saving tasks to localStorage:', error);
    throw error;
  }
};

// Function to restore tasks from backup if main storage is corrupted
export const restoreFromBackup = (): Task[] => {
  try {
    const backupJson = localStorage.getItem(TASKS_BACKUP_KEY);
    if (!backupJson) {
      console.warn('No backup found to restore from');
      return [];
    }

    const tasks = JSON.parse(backupJson);
    if (Array.isArray(tasks)) {
      // Restore the main storage from backup
      localStorage.setItem(TASKS_KEY, backupJson);
      console.info('Restored tasks from backup successfully');
      return tasks;
    } else {
      console.error('Backup data is not in valid format');
      return [];
    }
  } catch (error) {
    console.error('Error restoring tasks from backup:', error);
    return [];
  }
};

export const addTask = (task: Omit<Task, 'id' | 'created_at'>): Task => {
  // Check if localStorage is available before proceeding
  if (typeof Storage === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is not available');
  }

  const newTask: Task = {
    ...task,
    id: generateId(),
    created_at: new Date().toISOString()
  };

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  return newTask;
};

export const updateTask = (updatedTask: Task): Task => {
  // Check if localStorage is available before proceeding
  if (typeof Storage === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is not available');
  }

  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === updatedTask.id);

  if (index === -1) {
    throw new Error(`Task with id ${updatedTask.id} not found`);
  }

  tasks[index] = updatedTask;
  saveTasks(tasks);

  return updatedTask;
};

export const deleteTask = (taskId: string): void => {
  // Check if localStorage is available before proceeding
  if (typeof Storage === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is not available');
  }

  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);

  if (filteredTasks.length === tasks.length) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  saveTasks(filteredTasks);
};

export const toggleComplete = (taskId: string): Task => {
  // Check if localStorage is available before proceeding
  if (typeof Storage === 'undefined' || !window.localStorage) {
    throw new Error('localStorage is not available');
  }

  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  const updatedTask = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed
  };

  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);

  return updatedTask;
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};