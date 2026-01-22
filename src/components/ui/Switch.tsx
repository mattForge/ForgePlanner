import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority'; // Optional, or use plain Tailwind

const switchVariants = cva(
  "inline-flex items-center h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ 
  className, 
  checked, 
  onCheckedChange, 
  disabled,
  ...props 
}: SwitchProps) {
  return (
    <button
      className={switchVariants({ variant: "default", className })}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      {...props}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`block h-5 w-5 rounded-full transition-transform bg-background shadow-lg ring-0 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
