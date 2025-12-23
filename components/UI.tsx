import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider rounded-none";
  
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 border border-black",
    secondary: "bg-neutral-100 text-black hover:bg-neutral-200 border border-transparent",
    outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-4 py-3 bg-white border border-neutral-300 focus:border-black focus:outline-none transition-colors duration-200 rounded-none placeholder-neutral-400 ${className}`}
      {...props}
    />
  );
};

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block px-2 py-1 text-xs font-mono text-neutral-500 border border-neutral-200 rounded-none bg-neutral-50">
    {children}
  </span>
);