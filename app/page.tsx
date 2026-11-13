import ScrollBasedContent from '@/components/ScrollBasedContent'
import { intro, projects, jobs, certificates, getSkills } from '@/utils/portfolio'

export default function Home() {
  return <ScrollBasedContent introData={intro} projects={projects} jobs={jobs} certificates={certificates} skillsAggregation={getSkills()} />
}
