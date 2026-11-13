import Link from 'next/link';
export default function SkillTag({ skill, className = '', onClick }: { skill: string; className?: string; onClick?: () => void }) {
  const label = skill.trim();
  if (!label) return null;
  return <Link href={`/search?query=${encodeURIComponent(label)}`} onClick={onClick} className={`inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 ${className}`}>{label}</Link>;
}
