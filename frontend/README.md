# Todo App Frontend

A simple and intuitive todo application to help you manage your tasks with ease.

## Features

- Add, edit, delete, and mark tasks as complete/incomplete
- Responsive UI that works on mobile, tablet, and desktop
- LocalStorage persistence for tasks
- Input validation and error handling
- Loading indicators for operations
- Navigation component for consistent app experience
- SEO-friendly meta tags

## Tech Stack

- Next.js 16+ with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- LocalStorage for temporary data persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install` or `yarn install`
4. Run the development server: `npm run dev` or `yarn dev`
5. Visit `http://localhost:3000` in your browser

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run TypeScript and ESLint checks

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── utils/            # Utility functions (LocalStorage operations)
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Pages

- `/` - Home page with navigation hub
- `/tasks` - View and manage existing tasks
- `/add` - Create new tasks

## Data Model

The application uses a Task entity with the following fields:

- `id`: Unique identifier for the task
- `title`: The main text of the task (required)
- `description`: Additional details about the task (optional)
- `completed`: Whether the task is completed (boolean)
- `priority`: Priority level (e.g., "low", "medium", "high") (optional)
- `tags`: Array of tags associated with the task (optional)
- `due_date`: Due date in ISO string format (optional)
- `recurring`: Recurrence pattern (e.g., "daily", "weekly", "monthly") (optional)
- `created_at`: Timestamp when the task was created in ISO format (required)

## Environment

This application uses LocalStorage as a temporary data store. All data is persisted locally in the browser and will be available after page refreshes. This is a temporary solution and will be replaced with a backend service in future phases.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.