import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-ink/70">{children}</label>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`focus-ring w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/30 ${props.className || ''}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`focus-ring w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/30 ${props.className || ''}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`focus-ring w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink ${props.className || ''}`}
    />
  );
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const variants = {
    primary: 'bg-flow-500 text-white hover:bg-flow-600 disabled:bg-flow-400/50',
    secondary: 'bg-ink/5 text-ink hover:bg-ink/10',
    danger: 'bg-clay-500 text-white hover:bg-clay-500/90',
  };
  return (
    <button
      {...props}
      className={`focus-ring rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}
