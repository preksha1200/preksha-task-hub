import { motion, AnimatePresence } from 'framer-motion';
import { TaskItem } from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
  activeTasks: Task[];
  completedTasks: Task[];
  showCompleted: boolean;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TaskList = ({ 
  activeTasks, 
  completedTasks, 
  showCompleted, 
  onUpdate, 
  onDelete, 
  onToggle 
}: TaskListProps) => {
  const hasActiveTasks = activeTasks.length > 0;
  const hasCompletedTasks = completedTasks.length > 0;

  if (!hasActiveTasks && !hasCompletedTasks) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500">
          Add your first task above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      {hasActiveTasks && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Active Tasks ({activeTasks.length})
          </h2>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      <AnimatePresence>
        {showCompleted && hasCompletedTasks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Completed Tasks ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
