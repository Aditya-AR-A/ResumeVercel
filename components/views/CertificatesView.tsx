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
    <Section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Certificates</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="text-center text-gray-500">
              <p>No featured certificates available at the moment.</p>
            </div>
          )}
        </div>
        <Button className="mt-8" href="/certificates">
          View All Certificates
        </Button>
      </div>
    </Section>
  );
};

export default CertificatesView;
