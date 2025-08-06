'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  href,
  target,
  rel,
}: ButtonProps) {
  const baseClasses = `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 ${className}`;

  // If href is provided, render as a link
  if (href) {
    // External link
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={baseClasses}
        >
          {children}
        </a>
      );
    }
    
    // Hash link (anchor)
    if (href.startsWith('#')) {
      return (
        <a
          href={href}
          className={baseClasses}
          onClick={(e) => {
            if (onClick) onClick();
            // Smooth scroll to element
            const element = document.getElementById(href.substring(1));
            if (element) {
              e.preventDefault();
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {children}
        </a>
      );
    }
    
    // Internal link
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
