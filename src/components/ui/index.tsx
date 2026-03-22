import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const ErrorState = ({ 
    title = "Connection Failed", 
    message = "We couldn't reach the backend services. Please ensure your Docker containers are running and try again.",
    onRetry,
    error,
    icon: Icon
}: { 
    title?: string; 
    message?: string; 
    onRetry?: () => void;
    error?: string;
    icon?: React.ElementType;
}) => {
    const [showDetails, setShowDetails] = React.useState(false);
    
    return (
        <Card className="max-w-2xl mx-auto my-12 p-8 border-red-500/20 bg-red-500/[0.02] relative group overflow-hidden">
            <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none" />
            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                    {Icon ? React.createElement(Icon as any, { size: 32 }) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{message}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    {onRetry && (
                        <Button 
                            onClick={onRetry}
                            className="bg-white/5 hover:bg-white/10 border-white/10 gap-2"
                        >
                            Try Again
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs uppercase tracking-widest font-bold opacity-50 hover:opacity-100"
                    >
                        {showDetails ? 'Hide' : 'View'} Diagnostic Data
                    </Button>
                </div>

                {showDetails && error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5"
                    >
                        <p className="text-[10px] font-mono text-red-400/70 break-all leading-tight">
                            {error}
                        </p>
                    </motion.div>
                )}
            </div>
        </Card>
    );
};
