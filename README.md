# Donezo ✅

A professional, cloud-based task management application built with React + TypeScript + Supabase. Features enterprise-level user authentication, real-time database persistence, and a modern, responsive UI design.

🌐 **Live Demo**: [https://preksha-todo-app.vercel.app/](https://preksha-todo-app.vercel.app/)

## ✨ Features

### 🔐 Authentication & Security
- **Multi-User Support**: Individual user accounts with secure authentication
- **Email/Password Authentication**: Secure signup and login functionality
- **Protected Routes**: Unauthenticated users cannot access task management
- **Session Management**: Persistent sessions with automatic logout on expiry
- **Row Level Security (RLS)**: Database-level user data isolation
- **Modern Auth UI**: Clean, centered authentication interface with theme toggle

### 🗄️ Cloud Database
- **PostgreSQL Backend**: Powered by Supabase for enterprise-grade data persistence
- **Real-time Sync**: Tasks persist across devices and sessions
- **User Data Isolation**: Each user can only access their own tasks
- **Secure CRUD Operations**: All database operations are user-scoped and authenticated
- **Data Relationships**: Proper database schema with users → profiles → tasks
- **Performance Optimized**: Database indexes for fast queries

### 🎨 Modern Design
- **Sidebar Layout**: Beautiful sidebar with CheckSquare logo and organized sections
- **Vibrant Priority System**: Bold red, orange, and green colors for High/Medium/Low priorities
- **Dynamic Progress Bar**: Visual progress tracking with gradient fill and real-time updates
- **Dark/Light Theme**: Complete theme toggle with system preference detection
- **Custom Favicon**: Purple CheckSquare icon matching app branding
- **Professional Branding**: "Donezo" throughout the interface
- **Dynamic Greetings**: Time-based personalized greetings (Good morning/afternoon/evening)

### 📝 Task Management
- **Complete CRUD Operations**: Add, edit, delete, and toggle task completion
- **Additional Notes**: Expandable textarea for detailed task context with FileText icon
- **Priority Levels**: High (Red), Medium (Orange), Low (Green) with visual indicators
- **Inline Editing**: Hover over tasks to reveal edit and delete buttons with smooth animations
- **Smart Filtering**: All Tasks, Active, and Completed filter tabs
- **Task Timestamps**: Shows creation time for each task
- **Confirmation Dialogs**: Safe deletion with user confirmation

### 🎛️ Quick Actions
- **View All Tasks**: Switch to show all tasks with one click
- **Toggle Completed**: Show/hide completed tasks with dynamic button text
- **Export Tasks**: Download tasks as JSON file with date-stamped filename
- **Real-time Statistics**: Live task counts and completion percentages

### 🎯 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Enter to add tasks, Enter/Escape for editing, intuitive navigation
- **Loading States**: User feedback during database operations
- **Error Handling**: Graceful error messages and recovery
- **Smooth Animations**: 0.3s transitions for all interactions
- **Accessibility**: Proper focus states, ARIA labels, and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/preksha1200/preksha-task-hub.git
cd preksha-task-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API to get your credentials
   - Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor

4. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Sign up for a new account to start using Donezo!

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email/Password)

## 🗄️ Database Schema

The app uses three main tables:

- **profiles**: User profile information
- **tasks**: User tasks with priorities, notes, and completion status
- **task_shares**: Future feature for sharing tasks between users

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## 🔒 Security Features

- **Row Level Security**: Database-level user isolation
- **Environment Variables**: Sensitive credentials stored securely
- **Protected Routes**: Authentication required for app access
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: TypeScript provides compile-time type safety
- **Session Management**: Secure token handling via Supabase
