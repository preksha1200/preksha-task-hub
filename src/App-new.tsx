import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Check, Circle, BarChart3, Clock, Flag, FileText, Download, Settings, Moon, Paperclip } from 'lucide-react';

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
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

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

  // Load tasks from localStorage or use sample tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('preksha_todos_v1');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(sampleTasks);
    }
  }, []);

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
        notes: '',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        priority: newTaskPriority
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskPriority('Medium');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
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
            <Circle className="logo-icon" />
            <span className="logo-text">Preksha's Task Hub</span>
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">Overview</h3>
          <div className="progress-item">
            <span className="progress-label">Progress</span>
            <span className="progress-value">0%</span>
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
          <button className="sidebar-btn">
            <FileText className="btn-icon" />
            View all tasks
          </button>
          <button className="sidebar-btn">
            <Check className="btn-icon" />
            Show completed
          </button>
          <button className="sidebar-btn">
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
            <h1 className="greeting">Good evening, Preksha!</h1>
            <p className="date">{formatDate()}</p>
          </div>
          <div className="header-right">
            <span className="task-counter active">{activeTasks.length} active</span>
            <span className="task-counter completed">{completedTasks.length} done</span>
            <button className="theme-toggle">
              <Moon className="icon" />
            </button>
          </div>
        </header>

        {/* Task Input */}
        <div className="task-input-section">
          <h2 className="section-title">Add New Task</h2>
          <p className="section-subtitle">What would you like to accomplish today?</p>
          
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
            <button className="attach-btn">
              <Paperclip className="icon" />
            </button>
            <button 
              onClick={addTask}
              className="add-btn"
              disabled={!newTaskTitle.trim()}
            >
              Add Task
            </button>
          </div>
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
                
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  {task.notes && (
                    <p className="task-notes">{task.notes}</p>
                  )}
                  <div className="task-meta">
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="task-time">Today at 6:31 PM</span>
                  </div>
                </div>
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
