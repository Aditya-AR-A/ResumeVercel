"use client";

import React from 'react';
import Section from '@/components/Section';
import Button from '@/components/Button';
import CertificateCard from '@/components/CertificateCard';
import { Certificate } from '@/types/interfaces';
import { toSlug } from '@/utils/slug';

interface CertificatesViewProps {
  certificates: Certificate[];
}

const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates }) => {
  const featuredCertificates = Array.isArray(certificates) ? certificates.filter(certificate => certificate.featured) : [];

  return (
    <Section className="py-16 bg-gray-50 dark:bg-gray-900" containerClassName="max-w-5xl">
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="heading-gradient text-4xl font-bold">Featured Certificates</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Recognitions that mirror the depth of the featured projects and roles highlighted above.
          </p>
        </div>
        <div className="space-y-6">
          {featuredCertificates.length > 0 ? (
            featuredCertificates.map((certificate, index) => {
              const slug = toSlug(certificate.name);

              return (
                <CertificateCard
                  key={certificate.name}
                  certificate={certificate}
                  href={`/certificates/${slug}`}
                  priority={index === 0}
                />
              );
            })
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No featured certificates available at the moment.</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <Button className="btn-primary" href="/certificates">
            View All Certificates
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default CertificatesView;
