import { Eye, EyeOff } from 'lucide-react';

interface FooterProps {
  activeCount: number;
  completedCount: number;
  showCompleted: boolean;
  onToggleCompleted: () => void;
}

export const Footer = ({ 
  activeCount, 
  completedCount, 
  showCompleted, 
  onToggleCompleted 
}: FooterProps) => {
  return (
    <footer className="mt-8 flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-4">
        <span>
          {activeCount} remaining
        </span>
        {completedCount > 0 && (
          <span>
            {completedCount} completed
          </span>
        )}
      </div>

      {completedCount > 0 && (
        <button
          onClick={onToggleCompleted}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={showCompleted ? 'Hide completed tasks' : 'Show completed tasks'}
        >
          {showCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
          {showCompleted ? 'Hide completed' : 'Show completed'}
        </button>
      )}
    </footer>
  );
};
