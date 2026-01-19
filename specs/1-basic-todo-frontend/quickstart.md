# Frontend Quickstart Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Setup Instructions

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Run the development server
```bash
npm run dev
# or
yarn dev
```

### 4. Open the application
Visit `http://localhost:3000` in your browser to access the Todo app.

## Available Pages
- Home: `http://localhost:3000/` - Main navigation hub
- Add Task: `http://localhost:3000/add` - Create new tasks
- Tasks: `http://localhost:3000/tasks` - View and manage existing tasks

## Development Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run TypeScript and ESLint checks

## Key Technologies
- Next.js 16+ with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- LocalStorage for temporary data persistence

## Project Structure
- `frontend/src/app` - Next.js App Router pages
- `frontend/src/components` - Reusable UI components
- `frontend/src/utils` - Utility functions (LocalStorage operations)
- `frontend/src/types` - TypeScript type definitions

## Features Implemented
- Add, edit, delete, and mark tasks as complete/incomplete
- Responsive UI that works on mobile, tablet, and desktop
- LocalStorage persistence for tasks
- Input validation and error handling
- Loading indicators for operations
- Navigation component for consistent app experience
- SEO-friendly meta tags