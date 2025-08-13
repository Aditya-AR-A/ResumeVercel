"use client";

import React from 'react';
import Section from '@/components/Section';
import Button from '@/components/Button';
import { IntroData } from '@/types/interfaces';

interface ContactViewProps {
  introData: IntroData;
}

const ContactView: React.FC<ContactViewProps> = ({ introData }) => {
  return (
    <Section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 heading-gradient">
          Let&apos;s Connect
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          I&apos;m always interested in new opportunities and collaborations. 
          Feel free to reach out if you&apos;d like to discuss projects, job opportunities, or just chat about technology!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="btn-primary" href={`mailto:${introData.socialLinks.email}`}>
            Send Email
          </Button>
          <Button className="btn-secondary" href={introData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Button>
          <Button className="btn-secondary" href={introData.socialLinks.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default ContactView;
