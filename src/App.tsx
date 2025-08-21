import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Check, Circle, Moon, Sun, Edit2, Trash2, FileText, Download, CheckSquare } from 'lucide-react';

type Priority = 'High' | 'Medium' | 'Low';
type FilterType = 'all' | 'active' | 'completed';

interface Task {
  id: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
  priority: Priority;
}

function App() {
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

  // Sample tasks matching the Figma design
  const sampleTasks: Task[] = [
    {
      id: uuidv4(),
      title: 'Plan Kubeflow migration checklist',
      notes: '',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: 'Low'
    },
    {
      id: uuidv4(),
      title: '30-min deep work block',
      notes: 'No Slack',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: 'Medium'
    },
    {
      id: uuidv4(),
      title: 'Draft weekly update',
      notes: 'Outline metrics + risks',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      priority: 'High'
    }
  ];

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('preksha_todos_v1');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Set sample tasks on first load
      setTasks(sampleTasks);
    }
  }, []);

  // Load theme from localStorage and apply to document
  useEffect(() => {
    const savedTheme = localStorage.getItem('preksha_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('preksha_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('preksha_todos_v1', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        title: newTaskTitle.trim(),
        notes: newTaskNotes.trim(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        priority: newTaskPriority
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskNotes('');
      setShowAdditionalNotes(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditNotes(task.notes || '');
  };

  const saveTaskEdit = (id: string) => {
    if (editTitle.trim()) {
      setTasks(tasks.map(task => 
        task.id === id 
          ? { ...task, title: editTitle.trim(), notes: editNotes.trim() }
          : task
      ));
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditNotes('');
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleViewAllTasks = () => {
    setActiveFilter('all');
    setShowCompletedTasks(true);
  };

  const handleToggleCompleted = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `preksha-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'active': return activeTasks;
      case 'completed': return completedTasks;
      default: return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <CheckSquare className="logo-icon" />
            <span className="logo-text">Preksha's Task Hub</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Overview</h3>
          <div className="progress-item">
            <span className="progress-label">Progress</span>
            <span className="progress-value">{progressPercentage}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="stats-item">
            <Circle className="stat-icon total" />
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stats-item">
            <Circle className="stat-icon active" />
            <span className="stat-label">Active</span>
            <span className="stat-value">{activeTasks.length}</span>
          </div>
          <div className="stats-item">
            <Circle className="stat-icon completed" />
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedTasks.length}</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Quick Actions</h3>
          <button className="sidebar-btn" onClick={handleViewAllTasks}>
            <FileText className="btn-icon" />
            View all tasks
          </button>
          <button className="sidebar-btn" onClick={handleToggleCompleted}>
            <Check className="btn-icon" />
            {showCompletedTasks ? 'Hide completed' : 'Show completed'}
          </button>
          <button className="sidebar-btn" onClick={handleExportTasks}>
            <Download className="btn-icon" />
            Export tasks
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Priority Levels</h3>
          <div className="priority-item">
            <Circle className="priority-dot high" />
            <span className="priority-label">High Priority</span>
          </div>
          <div className="priority-item">
            <Circle className="priority-dot medium" />
            <span className="priority-label">Medium Priority</span>
          </div>
          <div className="priority-item">
            <Circle className="priority-dot low" />
            <span className="priority-label">Low Priority</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="greeting">{getGreeting()}, Preksha!</h1>
            <p className="date">{formatDate()}</p>
          </div>
          <div className="header-right">
            <span className="task-counter active">{activeTasks.length} active</span>
            <span className="task-counter completed">{completedTasks.length} done</span>
            <button className="theme-toggle" onClick={toggleTheme}>
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
                  className={`priority-btn ${getPriorityColor(priority)} ${newTaskPriority === priority ? 'active' : ''}`}
                  onClick={() => setNewTaskPriority(priority)}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="input-row">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task description..."
              className="task-input"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              className={`notes-toggle-btn ${showAdditionalNotes ? 'active' : ''}`}
              onClick={() => setShowAdditionalNotes(!showAdditionalNotes)}
            >
              <FileText className="icon" />
            </button>
            <button 
              onClick={addTask}
              className="add-btn"
              disabled={!newTaskTitle.trim()}
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
                placeholder="Add any additional details, reminders, or context..."
                className="notes-textarea"
                rows={3}
              />
              <p className="notes-example">Example: For "grocery shopping" → "Milk, bread, eggs, tomatoes"</p>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-section">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
              onClick={() => setActiveFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          <div className="view-options">
            <span className="view-label">View options:</span>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showCompletedTasks}
                onChange={(e) => setShowCompletedTasks(e.target.checked)}
              />
              Show completed tasks
            </label>
            <button className="more-options">•••</button>
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks in this view. Add your first task above! 🎯</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                <button
                  className="task-checkbox"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.isCompleted ? (
                    <Check className="check-icon" />
                  ) : (
                    <div className="circle-icon" />
                  )}
                </button>
                
                {editingTask === task.id ? (
                  <div className="task-content editing">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-title-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveTaskEdit(task.id);
                        } else if (e.key === 'Escape') {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="edit-notes-input"
                      placeholder="Additional notes..."
                      rows={2}
                    />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={() => saveTaskEdit(task.id)}>Save</button>
                      <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    {task.notes && (
                      <p className="task-notes">{task.notes}</p>
                    )}
                    <div className="task-meta">
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="task-time">Today at {new Date(task.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  </div>
                )}
                
                {editingTask !== task.id && (
                  <div className="task-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => startEdit(task)}
                      title="Edit task"
                    >
                      <Edit2 className="icon" />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteTask(task.id)}
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

        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">Showing {filteredTasks.length} of {tasks.length} tasks</p>
          <p className="footer-text">{completedTasks.length > 0 ? `${Math.round((completedTasks.length / tasks.length) * 100)}% completed` : '0% completed'}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
