import React from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label?: string;
  className?: string;
}

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & FieldProps> = ({ label, className = '', ...props }) => (
  <div className={`field ${className}`}>
    {label && <label>{label}</label>}
    <input {...props} />
  </div>
);

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & FieldProps> = ({ label, className = '', children, ...props }) => (
  <div className={`field ${className}`}>
    {label && <label>{label}</label>}
    <select {...props}>{children}</select>
  </div>
);

export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps> = ({ label, className = '', ...props }) => (
  <div className={`field ${className}`}>
    {label && <label>{label}</label>}
    <textarea {...props}></textarea>
  </div>
);
