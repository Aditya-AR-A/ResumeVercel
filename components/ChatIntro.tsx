"use client";

import React, { useState } from 'react';

const ChatIntro: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message to the chat
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);

    // Clear input field
    setInput('');

    // Simulate AI response (to be replaced with backend integration)
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'This is a simulated AI response.' }]);
    }, 1000);
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
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatIntro;
