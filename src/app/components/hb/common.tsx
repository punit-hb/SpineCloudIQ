import React, { useEffect, useRef } from 'react';
import { X, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

// ── FormModal ─────────────────────────────────────────────
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormModal({ isOpen, onClose, title, description, children }: FormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-[160] flex flex-col max-h-[90vh] animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white leading-none">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="slim-scroll flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── FormGrid ──────────────────────────────────────────────
export function FormGrid({ cols = 2, children, className = '' }: { cols?: number; children: React.ReactNode; className?: string }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[cols] || 'grid-cols-1 md:grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {children}
    </div>
  );
}

// ── FormField ─────────────────────────────────────────────
export function FormField({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {children}
    </div>
  );
}

// ── FormLabel ─────────────────────────────────────────────
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({ required, children, className = '', ...props }: FormLabelProps) {
  return (
    <label
      {...props}
      className={`text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1 font-sans">*</span>}
    </label>
  );
}

// ── FormInput ─────────────────────────────────────────────
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`w-full h-10 px-3 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 disabled:opacity-50 transition-all ${className}`}
        {...props}
      />
    );
  }
);
FormInput.displayName = 'FormInput';

// ── FormTextarea ──────────────────────────────────────────
export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[80px] p-3 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 disabled:opacity-50 transition-all resize-y ${className}`}
        {...props}
      />
    );
  }
);
FormTextarea.displayName = 'FormTextarea';

// ── FormFooter ────────────────────────────────────────────
export function FormFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 ${className}`}>
      {children}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  valueClassName?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ label, value, icon: Icon, valueClassName = '', trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {label}
          </span>
          {Icon && (
            <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <p className={`text-2xl font-bold text-neutral-900 dark:text-white ${valueClassName}`}>
          {value}
        </p>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.positive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          )}
          <span
            className={`text-xs font-medium ${
              trend.positive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}

// ── FormSection ───────────────────────────────────────────
export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── FormSelect ────────────────────────────────────────────
export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full h-10 px-3 pr-8 text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white disabled:opacity-50 appearance-none transition-all ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500 dark:text-neutral-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);
FormSelect.displayName = 'FormSelect';

// ── StatusSlider ──────────────────────────────────────────
interface StatusSliderOption {
  value: string;
  label: string;
  color?: string;
}

interface StatusSliderProps {
  value: string;
  onChange: (val: string) => void;
  options: StatusSliderOption[];
}

export function StatusSlider({ value, onChange, options }: StatusSliderProps) {
  return (
    <div className="flex h-10 p-1 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 w-full">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-800'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {opt.color && (
              <span className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
