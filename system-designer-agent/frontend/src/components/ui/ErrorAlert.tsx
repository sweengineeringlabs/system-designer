import { AlertTriangle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
    >
      <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
          aria-label="Dismiss error"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
