import React from 'react'
import { loadJson } from '@/utils/loadJson'
import Card from '@/components/Card'
import Section from '@/components/Section'
import { Certificate } from '@/types/interfaces';

export default async function CertificatesPage() {
  const certificates: Certificate[] = loadJson('certificates.json');

  // Group certificates by field/category
  const certificatesByField = certificates.reduce((acc, cert) => {
    const field = cert.field || 'Other';
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

  return (
    <div className="min-h-screen pt-8">
      {/* Header */}
      <Section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 heading-gradient">
            Certificates & Achievements
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            My professional certifications and achievements in data science, machine learning, and programming.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {certificates.length}+
              </div>
              <div className="text-gray-600 dark:text-gray-400">Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(certificatesByField).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Fields</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {certificates.filter(cert => cert.featured).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {new Set(certificates.map(cert => cert.provider)).size}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Providers</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Certificates */}
      {certificates.some(cert => cert.featured) && (
        <Section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 heading-gradient">
              Featured Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.filter(cert => cert.featured).map((cert) => (
                <Card
                  key={cert.name}
                  title={cert.name}
                  description={cert.description || `Issued by ${cert.provider}${cert.issueDate ? ` • ${cert.issueDate}` : ''}`}
                  imageUrl={`/certificate_thumbnails/${cert.file.replace('.pdf', '.png')}`}
                  linkUrl={`/Cerificates/${cert.file}`}
                  tags={cert.skills?.slice(0, 4)}
                  featured={cert.featured}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Certificates by Field */}
      {Object.entries(certificatesByField).map(([field, fieldCertificates], index) => (
        <Section key={field} className={`py-16 ${index % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-900'}`}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 heading-gradient">
              {field}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fieldCertificates.map((cert) => (
                <Card
                  key={cert.name}
                  title={cert.name}
                  description={cert.description || `Issued by ${cert.provider}${cert.issueDate ? ` • ${cert.issueDate}` : ''}`}
                  imageUrl={`/certificate_thumbnails/${cert.file.replace('.pdf', '.png')}`}
                  linkUrl={`/Cerificates/${cert.file}`}
                  tags={cert.skills?.slice(0, 4)}
                  featured={cert.featured}
                />
              ))}
            </div>
          </div>
        </Section>
      ))}

      {/* Call to Action */}
      <Section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 heading-gradient">
            Continuous Learning
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always expanding my skills and knowledge. Let&apos;s discuss how my expertise can help your projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Get In Touch
            </a>
            <a
              href="/projects"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              View Projects
            </a>
            <a
              href="/"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
