import React from 'react';
import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <FiLoader className={`${sizeClasses[size]} animate-spin text-secondary`} />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
