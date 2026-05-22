import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  size?: 'default' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth, size = 'default', icon, className = '', ...props 
}) => {
  let cls = 'btn';
  if (variant === 'primary') cls += ' btn-primary';
  if (variant === 'secondary') cls += ' btn-secondary';
  if (variant === 'ghost') cls += ' btn-ghost';
  if (fullWidth) cls += ' btn-full';
  if (size === 'lg') cls += ' btn-lg';

  return (
    <button className={`${cls} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
};
