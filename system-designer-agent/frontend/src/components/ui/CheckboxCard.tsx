import { useId } from 'react';
import type { CheckboxCardProps } from '@/types';

export function CheckboxCard({ label, description, checked, onChange }: CheckboxCardProps) {
  const id = useId();

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`
        p-4 rounded-2xl border-2 transition-all cursor-pointer
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        ${checked ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}
      `}
    >
      <div className="flex items-center gap-3 mb-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
        />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <p className="text-[10px] text-slate-500">{description}</p>
    </div>
  );
}
