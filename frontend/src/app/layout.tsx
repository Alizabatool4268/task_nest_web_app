import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App - Manage Your Tasks Efficiently',
  description: 'A simple and intuitive todo application to help you manage your tasks with ease',
  keywords: 'todo, tasks, productivity, task management, organizer',
  authors: [{ name: 'Todo App Team' }],
  creator: 'Todo App Team',
  publisher: 'Todo App Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Todo App - Manage Your Tasks Efficiently',
    description: 'A simple and intuitive todo application to help you manage your tasks with ease',
    type: 'website',
    siteName: 'Todo App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todo App - Manage Your Tasks Efficiently',
    description: 'A simple and intuitive todo application to help you manage your tasks with ease',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}