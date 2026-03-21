import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button Component ---

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-[var(--grad-primary)] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    outline: 'border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10',
    ghost: 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5',
    glass: 'glass text-white hover:bg-white/10 border-white/5 shimmer',
    danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm font-semibold',
    lg: 'px-8 py-4 text-base font-bold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : (
        children
      )}
    </motion.button>
  );
};

// --- Input Component ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">{label}</label>}
      <input
        className={cn(
          'w-full rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-sm text-white transition-all appearance-none',
          'placeholder:text-white/10 focus:outline-none focus:border-[var(--accent-primary)]/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          props.readOnly && 'cursor-default opacity-80 bg-transparent border-white/[0.02]',
          error && 'border-[var(--danger)]/50 focus:border-[var(--danger)]/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
};

// --- Card Component ---

export const Card = ({ 
  children, 
  className, 
  glass = true, 
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string; 
  glass?: boolean;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        'rounded-2xl p-6 transition-all border border-transparent',
        glass ? 'glass glass-card' : 'bg-[var(--bg-secondary)] border-white/5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// --- Badge Component ---

export const Badge = ({ children, variant = 'neutral', className }: any) => {
    const variants: any = {
        neutral: 'bg-white/5 text-[var(--text-secondary)] border-white/10',
        primary: 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20',
        success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
        danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
    };
    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};
