"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

interface WrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

function FieldWrapper({ label, hint, error, required, children }: WrapperProps & { children: React.ReactNode }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-error"> *</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-text-secondary">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-error">{error}</span>}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & WrapperProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, required, className, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <input ref={ref} required={required} className={cn(fieldClasses, error && "border-error", className)} {...props} />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & WrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, className, rows = 4, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        required={required}
        rows={rows}
        className={cn(fieldClasses, "resize-none", error && "border-error", className)}
        {...props}
      />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & WrapperProps & { options: { label: string; value: string }[]; placeholder?: string };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, className, options, placeholder, ...props }, ref) => (
    <FieldWrapper label={label} hint={hint} error={error} required={required}>
      <select ref={ref} required={required} className={cn(fieldClasses, error && "border-error", className)} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";
