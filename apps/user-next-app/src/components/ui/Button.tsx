import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-[#ff5901] text-white hover:bg-[#e04f00] focus:ring-[#ff5901]",
      secondary: "bg-[#111] text-white hover:bg-gray-800 focus:ring-gray-800",
      outline: "border border-gray-200 text-[#111] hover:border-[#ff5901] hover:text-[#ff5901] focus:ring-[#ff5901]",
      ghost: "bg-transparent text-[#111] hover:bg-gray-100 focus:ring-gray-200"
    };

    const sizes = {
      sm: "px-4 py-2 text-[13px]",
      md: "px-8 py-3.5 text-[14px]",
      lg: "px-8 py-4 text-[15px] rounded-xl" // Form submit buttons use xl radius
    };

    const LoadingSpinner = () => (
      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
