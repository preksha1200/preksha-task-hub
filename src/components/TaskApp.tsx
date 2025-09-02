import { useState, useEffect } from 'react';
import { Check, Circle, Moon, Sun, Edit2, Trash2, FileText, Download, CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Priority = 'High' | 'Medium' | 'Low';
type FilterType = 'all' | 'active' | 'completed';

// Task interface matching Supabase database schema
type Task = Database['public']['Tables']['tasks']['Row'];

export const TaskApp = () => {
  const { user, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Load tasks from Supabase database
  const loadTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks from Supabase on component mount
  useEffect(() => {
    loadTasks();
  }, [user]);

  // Add new task to Supabase database
  const addTask = async () => {
    if (!newTaskTitle.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: newTaskTitle.trim(),
          notes: newTaskNotes.trim() || null,
          priority: newTaskPriority,
          is_completed: false,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new task to local state
      setTasks(prev => [data, ...prev]);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskNotes('');
      setShowAdditionalNotes(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion in Supabase
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, is_completed: !t.is_completed } : t
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete task from Supabase
  const deleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('preksha_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('preksha_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('preksha_theme', 'light');
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
  };

  // Save task edit to Supabase
  const saveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          title: editTitle.trim(), 
          notes: editNotes.trim() || null 
        })
        .eq('id', editingTask);
      
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === editingTask 
          ? { ...task, title: editTitle.trim(), notes: editNotes.trim() || null }
          : task
      ));
      
      setEditingTask(null);
      setEditTitle('');
      setEditNotes('');
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditNotes('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: string) => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addTask();
      } else if (action === 'save') {
        saveEdit();
      }
    } else if (e.key === 'Escape' && action === 'cancel') {
      cancelEdit();
    }
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `preksha-tasks-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const viewAllTasks = () => {
    setActiveFilter('all');
    setShowCompletedTasks(true);
  };

  const toggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.is_completed;
    if (activeFilter === 'completed') return task.is_completed;
    return true;
  });

  const displayedTasks = showCompletedTasks ? filteredTasks : filteredTasks.filter(task => !task.is_completed);

  const completedTasks = tasks.filter(task => task.is_completed);
  const activeTasks = tasks.filter(task => !task.is_completed);
  const highPriorityTasks = activeTasks.filter(task => task.priority === 'High');
  const mediumPriorityTasks = activeTasks.filter(task => task.priority === 'Medium');
  const lowPriorityTasks = activeTasks.filter(task => task.priority === 'Low');

  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <CheckSquare className="logo-icon" />
            <span className="logo-text">Donezo</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Overview</h3>
          <div className="progress-item">
            <div className="progress-info">
              <span className="progress-label">Today's Progress</span>
              <span className="progress-value">{completionPercentage}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Task Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedTasks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">{activeTasks.length}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Quick Actions</h3>
          <button onClick={viewAllTasks} className="sidebar-btn">
            <FileText className="btn-icon" />
            View all tasks
          </button>
          <button onClick={toggleCompletedTasks} className="sidebar-btn">
            <Check className="btn-icon" />
            {showCompletedTasks ? 'Hide completed' : 'Show completed'}
          </button>
          <button onClick={exportTasks} className="sidebar-btn">
            <Download className="btn-icon" />
            Export tasks
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Priority Levels</h3>
          <div className="priority-item">
            <div className="priority-dot priority-high"></div>
            <span className="priority-label">High Priority</span>
            <span className="priority-count">{highPriorityTasks.length}</span>
          </div>
          <div className="priority-item">
            <div className="priority-dot priority-medium"></div>
            <span className="priority-label">Medium Priority</span>
            <span className="priority-count">{mediumPriorityTasks.length}</span>
          </div>
          <div className="priority-item">
            <div className="priority-dot priority-low"></div>
            <span className="priority-label">Low Priority</span>
            <span className="priority-count">{lowPriorityTasks.length}</span>
          </div>
        </div>

        {/* User Info & Sign Out */}
        <div className="sidebar-section mt-auto">
          <div className="user-info">
            <div className="user-avatar">
              <User className="w-5 h-5" />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="sidebar-btn sign-out-btn">
            <LogOut className="btn-icon" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="greeting">{getGreeting()}, {user?.user_metadata?.full_name || 'Preksha'}!</h1>
            <p className="date">{formatDate()}</p>
          </div>
          <div className="header-right">
            <div className="task-counters">
              <div className="counter">
                <span className="counter-value">{activeTasks.length}</span>
                <span className="counter-label">Active</span>
              </div>
              <div className="counter">
                <span className="counter-value">{completedTasks.length}</span>
                <span className="counter-label">Done</span>
              </div>
            </div>
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            </button>
          </div>
        </header>

        {/* Task Input */}
        <div className="task-input-section">
          <h2 className="section-title">Add New Task</h2>
          <p className="section-subtitle">
            What would you like to accomplish today?
            <span className="muscle-icon" style={{ marginLeft: '8px', fontSize: '18px' }}>💪</span>
          </p>
          
          <div className="priority-selector">
            <span className="priority-label">Priority Level</span>
            <div className="priority-buttons">
              {(['High', 'Medium', 'Low'] as Priority[]).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setNewTaskPriority(priority)}
                  className={`priority-btn priority-${priority.toLowerCase()} ${
                    newTaskPriority === priority ? 'active' : ''
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="task-input-row">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'add')}
              placeholder="Enter task title..."
              className="task-input"
            />
            <button 
              onClick={() => setShowAdditionalNotes(!showAdditionalNotes)}
              className={`notes-toggle-btn ${showAdditionalNotes ? 'active' : ''}`}
            >
              <FileText className="icon" />
            </button>
            <button 
              onClick={addTask}
              disabled={!newTaskTitle.trim()}
              className="add-btn"
            >
              Add Task
            </button>
          </div>

          {showAdditionalNotes && (
            <div className="additional-notes-section">
              <label className="notes-label">Additional Notes (optional)</label>
              <textarea
                value={newTaskNotes}
                onChange={(e) => setNewTaskNotes(e.target.value)}
                placeholder="Add any additional details, context, or notes for this task..."
                className="notes-textarea"
              />
              <p className="notes-example">
                Example: "Call John at 2 PM", "Review document before meeting", "Bring laptop charger"
              </p>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-section">
          <div className="filter-tabs">
            {(['all', 'active', 'completed'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="view-options">
            <span className="view-label">View:</span>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showCompletedTasks}
                onChange={toggleCompletedTasks}
              />
              Show completed
            </label>
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="loading-state">
              <p>Loading tasks...</p>
            </div>
          ) : displayedTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. {activeFilter === 'active' ? 'Add a new task to get started!' : 'Try changing your filter.'}</p>
            </div>
          ) : (
            displayedTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className="task-checkbox"
                >
                  {task.is_completed ? (
                    <Check className="icon completed" />
                  ) : (
                    <Circle className="icon" />
                  )}
                </button>

                <div className="task-content">
                  {editingTask === task.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'save')}
                        className="edit-input"
                        autoFocus
                      />
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Additional notes..."
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button onClick={saveEdit} className="save-btn">Save</button>
                        <button 
                          onClick={cancelEdit} 
                          onKeyPress={(e) => handleKeyPress(e, 'cancel')}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="task-title">{task.title}</h3>
                      {task.notes && <p className="task-notes">{task.notes}</p>}
                      <div className="task-meta">
                        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className="task-time">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {editingTask !== task.id && (
                  <div className="task-actions">
                    <button
                      onClick={() => startEditing(task)}
                      className="action-btn edit-btn"
                      title="Edit task"
                    >
                      <Edit2 className="icon" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="action-btn delete-btn"
                      title="Delete task"
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
