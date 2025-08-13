"use client";

import React from 'react';
import Image from 'next/image';
import Section from '@/components/Section';
import SkillTag from '@/components/SkillTag';
import Button from '@/components/Button';
import { Certificate } from '@/types/interfaces';

interface CertificatesViewProps {
  certificates: Certificate[];
}

const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates }) => {
  const featuredCertificates = certificates.filter(certificate => certificate.featured);

  return (
    <Section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Certificates</h2>
        <div className="space-y-12">
          {featuredCertificates.map(certificate => (
            <div key={certificate.name} className="relative w-full">
              <Image
                src={`/certificate_thumbnails/${certificate.file.replace('.pdf', '.png')}`}
                alt={certificate.name}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg shadow-lg"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-lg font-semibold px-4">{certificate.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {certificate.skills && certificate.skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-8" href="/certificates">
          View All Certificates
        </Button>
      </div>
    </Section>
  );
};

export default CertificatesView;
