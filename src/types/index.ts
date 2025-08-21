export type Priority = 'High' | 'Medium' | 'Low' | null;

export interface Task {
  id: string;
  title: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
  priority: Priority;
}

export interface TaskFilters {
  showCompleted: boolean;
  filterType: 'all' | 'active' | 'completed';
}
