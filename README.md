# Donezo ✅

A beautiful, production-ready task management web app built with React + Vite + TypeScript, featuring a modern sidebar design, vibrant priority system, and comprehensive task management functionality.

## ✨ Features

### 🎨 Modern Design
- **Sidebar Layout**: Beautiful sidebar with CheckSquare logo and organized sections
- **Vibrant Priority System**: Bold red, orange, and green colors for High/Medium/Low priorities
- **Dynamic Progress Bar**: Visual progress tracking with gradient fill
- **Custom Favicon**: Purple CheckSquare icon matching app branding
- **Professional Branding**: "Donezo" throughout the interface

### 📝 Task Management
- **Complete CRUD Operations**: Add, edit, delete, and toggle task completion
- **Additional Notes**: Expandable textarea for detailed task context
- **Priority Levels**: High (Red), Medium (Orange), Low (Green) with visual indicators
- **Inline Editing**: Hover over tasks to reveal edit and delete buttons
- **Smart Filtering**: All Tasks, Active, and Completed filter tabs
- **Task Timestamps**: Shows creation time for each task

### 🎛️ Quick Actions
- **View All Tasks**: Switch to show all tasks with one click
- **Toggle Completed**: Show/hide completed tasks with dynamic button text
- **Export Tasks**: Download tasks as JSON file with date-stamped filename

### 💾 Data & Persistence
- **localStorage Persistence**: All tasks saved locally with key 'preksha_todos_v1'
- **Sample Data**: Pre-loaded with realistic sample tasks on first use
- **JSON Export**: Full data export with IDs, titles, notes, priorities, and timestamps

### 🎯 User Experience
- **Personalized Greeting**: "Good evening, Preksha!" with current date
- **Keyboard Shortcuts**: Enter to add tasks, Enter/Escape for editing
- **Hover Actions**: Edit and delete buttons appear on task hover
- **Smooth Animations**: 0.3s transitions for progress bar and interactions
- **Mobile Responsive**: Works perfectly on all screen sizes
- **Accessibility**: Proper focus states and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
