import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-violet-200 dark:border-violet-900/30" />
      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-violet-600 animate-spin" />
    </div>
    <p className="text-muted-foreground text-sm font-medium animate-pulse">{message}</p>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-border overflow-hidden animate-pulse">
    <div className="h-48 shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-5 shimmer rounded-lg w-3/4" />
      <div className="h-4 shimmer rounded-lg w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 shimmer rounded-full w-20" />
        <div className="h-6 shimmer rounded-full w-16" />
      </div>
    </div>
  </div>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-4xl">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
    {action && <div className="pt-2">{action}</div>}
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-auto animate-slide-up border border-border`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
