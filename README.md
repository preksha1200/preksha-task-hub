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

## 🧪 Testing & Quality Assurance

### **Comprehensive Testing Suite**
- **Unit Tests**: Component and hook testing with Vitest + React Testing Library
- **Integration Tests**: Database operations and authentication flow testing
- **End-to-End Tests**: Full user journey testing with Playwright
- **Cross-Browser Testing**: Chrome, Firefox, Safari, and mobile devices
- **Coverage Reporting**: Detailed test coverage metrics with HTML reports

### **Testing Commands**
```bash
# Unit Tests
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run with coverage report
npm run test:ui           # Interactive test UI

# End-to-End Tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Interactive E2E test UI
npm run test:e2e:headed   # Run E2E tests with browser UI
npm run test:e2e:debug    # Debug E2E tests

# Quality Assurance
npm run lint              # ESLint code quality check
npm run type-check        # TypeScript type validation
npm run ci                # Full CI pipeline (lint + type + test + build)
npm run ci:full           # Complete CI with E2E tests
```

### **Test Coverage**
- **Components**: Auth, TaskApp, TaskItem, TaskInput
- **Hooks**: Authentication, task management, theme toggle
- **User Flows**: Signup, login, task CRUD, filtering, export
- **Responsive Design**: Mobile and desktop compatibility
- **Error Handling**: Network failures, validation errors

## 🚀 CI/CD Pipeline

### **GitHub Actions Workflow**
Automated quality assurance and deployment pipeline:

- ✅ **Code Quality**: ESLint validation
- ✅ **Type Safety**: TypeScript compilation check
- ✅ **Unit Testing**: Component and integration tests
- ✅ **E2E Testing**: Cross-browser user journey validation
- ✅ **Build Verification**: Production build success
- ✅ **Coverage Reporting**: Test coverage metrics
- ✅ **Automated Deployment**: Vercel production deployment

### **Multi-Node Testing Matrix**
- Node.js 18.x and 20.x compatibility
- Cross-platform testing (Ubuntu)
- Parallel test execution for faster feedback

### **Branch Protection**
Main branch protected with required status checks:
- All tests must pass
- Code coverage requirements met
- No TypeScript errors
- Successful production build

## 📊 Development Workflow

### **Contributing**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes with tests: `npm run test:watch`
4. Run full validation: `npm run ci:full`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request (triggers CI/CD pipeline)

### **Code Quality Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules
- **Testing**: Minimum 80% test coverage required
- **Documentation**: All features documented in README
- **Security**: No hardcoded secrets, proper environment variables
