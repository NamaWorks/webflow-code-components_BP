import React from 'react';

export interface ExampleButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ExampleButton = ({ label, disabled = false, onClick }: ExampleButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        disabled
          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      ].join(' ')}
    >
      {label}
    </button>
  );
};
