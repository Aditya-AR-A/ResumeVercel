import React from 'react'
import { SectionProps } from '@/types/interfaces';

export default function Section({
  id,
  className = '',
  children,
  containerClassName = '',
  background = 'default'
}: SectionProps) {
  const baseClasses = 'relative rounded-2xl border border-[var(--color-border)]';

  const getBackgroundClasses = () => {
    switch (background) {
      case 'gray':
        return `${baseClasses} bg-slate-100/60 dark:bg-slate-950/50`;
      case 'gradient':
        return `${baseClasses} bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_55%)]`;
      default:
        return `${baseClasses} bg-white/65 dark:bg-slate-950/60`;
    }
  };

  return (
    <section
      id={id}
      className={`${getBackgroundClasses()} ${className}`}
    >
      <div className={`container mx-auto px-4 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
