"use client";

import React, { useState } from 'react';
import { aiApi, apiUtils } from '@/utils/api';

const ChatIntro: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging for component lifecycle
  React.useEffect(() => {
    console.log('ChatIntro: Component mounted');

    // Test API connection on mount
    const testConnection = async () => {
      try {
        console.log('ChatIntro: Testing API connection...');
        const connectionTest = await apiUtils.testConnection();
        console.log('ChatIntro: API connection test result:', connectionTest);

        if (!connectionTest.available) {
          console.warn('ChatIntro: Backend API is not reachable!');
        } else {
          console.log('ChatIntro: Backend API is reachable');
        }
      } catch (error) {
        console.error('ChatIntro: Failed to test API connection:', error);
      }
    };

    testConnection();

    return () => console.log('ChatIntro: Component unmounted');
  }, []);

  // Debug logging for input changes
  React.useEffect(() => {
    if (input) {
      console.log('ChatIntro: Input changed to:', input);
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) {
      console.log('ChatIntro: Input is empty or already loading, skipping...');
      return;
    }

    const userMessage = input.trim();
    console.log('ChatIntro: Sending message:', userMessage);

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    // Clear input field
    setInput('');
    setIsLoading(true);

    try {
      console.log('ChatIntro: Calling AI API...');
      // Call the backend AI API
      const response = await aiApi.chat(userMessage);
      console.log('ChatIntro: AI API response:', response);

      // Add AI response to the chat
      setMessages((prev) => [...prev, {
        sender: 'ai',
        text: response.response || response.message || 'I received your message!'
      }]);
      console.log('ChatIntro: Message added to chat');
    } catch (error) {
      console.error('ChatIntro: AI API Error:', error);
      setMessages((prev) => [...prev, {
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
      console.log('ChatIntro: Loading state set to false');
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Intro Text */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Hi, I&apos;m <span className="heading-gradient">Your AI Portfolio Assistant</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Type in the field below to explore my projects, skills, and more!
        </p>
      </div>

      {/* Chat Messages */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 h-64 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet. Start by typing below!</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 text-gray-800 self-start'
              }`}
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="w-full max-w-2xl flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
          value={input}
          onChange={(e) => {
            console.log('ChatIntro: onChange triggered, new value:', e.target.value);
            setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            console.log('ChatIntro: onKeyDown triggered, key:', e.key);
            if (e.key === 'Enter') {
              console.log('ChatIntro: Enter key pressed, calling handleSendMessage');
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            console.log('ChatIntro: Send button clicked');
            handleSendMessage();
          }}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatIntro;
