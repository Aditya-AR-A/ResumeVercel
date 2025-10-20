import React from "react";

type FeaturedBadgeProps = {
  label?: string;
  className?: string;
};

export default function FeaturedBadge({ label = "Featured", className = "" }: FeaturedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-100 bg-gradient-to-r from-yellow-500/90 via-amber-500/90 to-orange-500/90 rounded-full shadow-sm shadow-yellow-500/30 border border-yellow-400/60 ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 text-yellow-50"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927a1 1 0 011.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.924-.755 1.688-1.54 1.118L10 13.347l-2.975 2.136c-.784.57-1.838-.194-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.39 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
      {label}
    </span>
  );
}
