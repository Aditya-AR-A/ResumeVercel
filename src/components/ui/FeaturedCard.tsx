import React from 'react';
import { featuredCard } from '@/styles/tw';

interface FeaturedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ children, className = '', ...props }) => (
  <div className={`${featuredCard} ${className}`} {...props}>
    {children}
  </div>
);

export default FeaturedCard;
