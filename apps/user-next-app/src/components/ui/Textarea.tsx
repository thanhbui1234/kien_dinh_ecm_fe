import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-[13px] font-medium text-gray-600 ml-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-5 py-4 bg-[#f8f8f8] border border-transparent rounded-xl text-[15px] outline-none transition-all focus:bg-white focus:border-[#ff5901] focus:shadow-[0_0_0_4px_rgba(255,89,1,0.1)] placeholder-gray-400 resize-none ${
            error ? 'border-red-500 bg-white' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500 ml-1 mt-1 m-0">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
