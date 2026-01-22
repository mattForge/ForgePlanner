import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  className = '',
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={`
        bg-white dark:bg-slate-800 
        rounded-2xl 
        shadow-sm dark:shadow-dark
        border border-gray-200 dark:border-slate-700 
        overflow-hidden
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
