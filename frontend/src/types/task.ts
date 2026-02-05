export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  tags?: string[];
  due_date?: string;
  recurring?: string;
  created_at: string;
  recurrence?: string | null;
}