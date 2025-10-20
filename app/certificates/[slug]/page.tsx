import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CertificateDetailView from '@/components/DetailView/CertificateDetailView'
import { toSlug } from '@/utils/slug'
import { dataApi } from '@/utils/api'
import type { Certificate } from '@/types/interfaces'

interface CertificatePageProps {
  params: { slug: string }
}

const toLegacyName = (value: string) => value.toLowerCase().replace(/\s+/g, '-')

async function loadCertificates(): Promise<Certificate[]> {
  try {
    const data = await dataApi.getCertificates()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('CertificateDetailPage: failed to fetch certificates from API', error)
    return []
  }
}

function findCertificateBySlug(certificates: Certificate[], slug: string): Certificate | undefined {
  return certificates.find((item) => {
    const currentSlug = toSlug(item.name)
    if (currentSlug === slug) {
      return true
    }

    const legacySlug = toLegacyName(item.name)
    return legacySlug === slug
  })
}

export async function generateStaticParams() {
  const certificates = await loadCertificates()
  return certificates.map((certificate) => ({ slug: toSlug(certificate.name) }))
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const certificates = await loadCertificates()
  const certificate = findCertificateBySlug(certificates, params.slug)

  if (!certificate) {
    return {
      title: 'Certificate Not Found',
    }
  }

  return {
    title: `${certificate.name} | Certificates`,
    description: certificate.description,
  }
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const certificates = await loadCertificates()
  const certificate = findCertificateBySlug(certificates, params.slug)

  if (!certificate) {
    notFound()
    return null
  }

  return <CertificateDetailView certificate={certificate} />
}
