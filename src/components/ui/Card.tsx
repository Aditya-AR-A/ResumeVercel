import React from 'react';
import { card } from '@/styles/tw';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`${card} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
