import PageHero from '@/components/PageHero'
import Section from '@/components/Section'
import ContactView from '@/components/views/ContactView'
import { dataApi } from '@/utils/api'
import type { IntroData } from '@/types/interfaces'

async function loadIntro(): Promise<IntroData | null> {
  try {
    const data = await dataApi.getIntro()
    return data as IntroData
  } catch {
    return null
  }
}

function defaultIntro(): IntroData {
  return {
    profileImage: { src: '', alt: '' },
    name: '',
    title: '',
    about: '',
    socialLinks: { email: '', github: '', linkedin: '' },
  }
}

export default async function ContactPage() {
  const introData = await loadIntro()
  return (
    <div className="space-y-12 py-12 lg:space-y-16 lg:py-16">
      <PageHero
        eyebrow="Contact"
        title="Get In Touch"
        description="Reach out for collaborations, consulting, or questions about my work and experience."
        align="left"
      />

      <Section background="default" containerClassName="max-w-5xl">
        <ContactView introData={introData || defaultIntro()} />
      </Section>
    </div>
  )
}

