"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const ChatProfile: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const handleCommand = () => {
    if (input.trim() === '') return;

    // Simulate AI task execution (to be replaced with backend integration)
    if (input.toLowerCase().includes('show projects')) {
      setResponse('Navigating to Projects Section...');
      // Simulate navigation or dynamic update
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setResponse(`Executing: ${input}`);
    }

    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center space-y-6">
      {/* Profile Section */}
      <div className="space-y-4">
        <Image
          src="/default.png"
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-4xl md:text-5xl font-bold">Aditya AR</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          AI and Python Developer | Building Intelligent Systems
        </p>
      </div>

      {/* Command Input */}
      <div className="w-full max-w-2xl flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleCommand}
        >
          Execute
        </button>
      </div>

      {/* Dynamic Response */}
      {response && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-800 dark:text-gray-200">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatProfile;
