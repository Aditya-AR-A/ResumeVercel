import React from 'react';
import Image from 'next/image';
import { CardProps } from '@/types/interfaces';

export default function Card({
  title,
  description,
  imageUrl,
  linkUrl,
  tags,
  featured,
  children,
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 transition border ${
        featured ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-gray-700 dark:text-gray-300 mb-2">{description}</p>}
      {tags && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      {children}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Learn more
        </a>
      )}
    </div>
  );
}
