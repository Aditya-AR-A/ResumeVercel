"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { aiApi } from '@/utils/api';

const ChatProfile: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging for component lifecycle
  React.useEffect(() => {
    console.log('ChatProfile: Component mounted');
    return () => console.log('ChatProfile: Component unmounted');
  }, []);

  // Debug logging for input changes
  React.useEffect(() => {
    if (input) {
      console.log('ChatProfile: Input changed to:', input);
    }
  }, [input]);

  const handleCommand = async () => {
    if (input.trim() === '' || isLoading) {
      console.log('ChatProfile: Input is empty or already loading, skipping...');
      return;
    }

    const command = input.trim();
    console.log('ChatProfile: Processing command:', command);

    setInput('');
    setIsLoading(true);

    try {
      console.log('ChatProfile: Calling AI API...');
      // Use AI API for command processing
      const aiResponse = await aiApi.chat(`Command: ${command}`);
      console.log('ChatProfile: AI API response:', aiResponse);

      setResponse(aiResponse.response || aiResponse.message || `Processed: ${command}`);
      console.log('ChatProfile: Response set successfully');

      // Handle specific navigation commands
      if (command.toLowerCase().includes('show projects')) {
        console.log('ChatProfile: Navigating to projects section');
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.toLowerCase().includes('show experience') || command.toLowerCase().includes('show work')) {
        console.log('ChatProfile: Navigating to experience section');
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.toLowerCase().includes('show certificates') || command.toLowerCase().includes('show cert')) {
        console.log('ChatProfile: Navigating to certificates section');
        document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('ChatProfile: AI API Error:', error);
      setResponse('Sorry, I encountered an error processing your command.');
    } finally {
      setIsLoading(false);
      console.log('ChatProfile: Loading state set to false');
    }
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
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder={isLoading ? "Processing command..." : "Type a command..."}
          value={input}
          onChange={(e) => {
            console.log('ChatProfile: onChange triggered, new value:', e.target.value);
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            console.log('ChatProfile: onKeyDown triggered, key:', e.key);
            if (e.key === 'Enter') {
              console.log('ChatProfile: Enter key pressed, calling handleCommand');
              handleCommand();
            }
          }}
          disabled={isLoading}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            console.log('ChatProfile: Execute button clicked');
            handleCommand();
          }}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Execute'}
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
