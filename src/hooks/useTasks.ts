import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Priority } from '../types';

const STORAGE_KEY = 'preksha_todos_v1';

const sampleTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Review quarterly goals',
    notes: 'Check progress on Q3 objectives and plan for Q4',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: 'High'
  },
  {
    id: uuidv4(),
    title: 'Schedule dentist appointment',
    notes: '',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: 'Medium'
  },
  {
    id: uuidv4(),
    title: 'Buy groceries for the week',
    notes: 'Milk, bread, fruits, vegetables',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    priority: 'Low'
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored tasks:', error);
        setTasks(sampleTasks);
      }
    } else {
      setTasks(sampleTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = useCallback((title: string, notes?: string, priority?: Priority) => {
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      notes: notes?.trim() || '',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: priority || null
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.isCompleted));
  }, []);

  // Selectors
  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  const activeCount = activeTasks.length;
  const completedCount = completedTasks.length;

  return {
    tasks,
    activeTasks,
    completedTasks,
    activeCount,
    completedCount,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted
  };
};
