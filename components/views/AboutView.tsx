"use client";

import React from 'react';
import Section from '@/components/Section';

const AboutView: React.FC = () => {
  return (
    <Section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 heading-gradient">
          About Me
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-6">
            <p>
              I&apos;m a passionate <strong>AI and Python Developer</strong> with expertise in building 
              intelligent systems that solve real-world problems. Currently working at Addmin Web World, 
              I specialize in integrating <strong>LLMs with SIP call agents</strong> and developing 
              AI-driven automation solutions.
            </p>
            <p>
              My journey in technology spans over 3 years, during which I&apos;ve developed a deep 
              understanding of machine learning, natural language processing, and full-stack development. 
              I&apos;m particularly interested in creating AI solutions that enhance human productivity 
              and decision-making.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring the latest AI research papers, 
              contributing to open-source projects, or mentoring aspiring developers in the field 
              of artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Technical Skills</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Python, JavaScript, TypeScript</li>
                <li>• Machine Learning & Deep Learning</li>
                <li>• Natural Language Processing</li>
                <li>• React, Next.js, Node.js</li>
                <li>• TensorFlow, PyTorch, Scikit-learn</li>
                <li>• Docker, AWS, PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Interests</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Artificial Intelligence Research</li>
                <li>• Open Source Contributions</li>
                <li>• Technical Writing & Blogging</li>
                <li>• Mentoring & Teaching</li>
                <li>• Automation & DevOps</li>
                <li>• Data Science & Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutView;
