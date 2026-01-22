import React from 'react';
export type BadgeVariant =
'default' |
'success' |
'warning' |
'error' |
'neutral' |
'blue';
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    neutral: 'bg-gray-100 text-gray-600',
    success: 'bg-green-50 text-green-700 border border-green-100',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    error: 'bg-red-50 text-red-700 border border-red-100',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>

      {children}
    </span>);

}