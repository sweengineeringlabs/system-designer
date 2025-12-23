import { useId } from 'react';
import type { TextAreaProps } from '@/types';

export function TextArea({ label, value, onChange, placeholder, error, required }: TextAreaProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col group">
      <label
        htmlFor={id}
        className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2 group-focus-within:text-blue-600 transition-colors"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          bg-slate-50 border-2 rounded-2xl px-5 py-3.5
          focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
          outline-none transition-all h-32 resize-none
          font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-100'}
        `}
      />
      {error && (
        <p
          id={errorId}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
