import styles from "./page.module.css";
import Intro from "./sections/Intro/Intro";
import FeaturedCertifications from "./sections/FeaturedCertifications";
import Jobs from "./jobs/Jobs";
import Projects from "./projects/Projects";
import Link from "next/link";
import pageData from "@/data/page.json";
import layoutData from "@/data/layout.json";
import { PageConfig } from "@/types/page";
import { LayoutConfig } from "@/types/layout";

export default function Home() {
  const config: PageConfig = pageData;
  const layoutConfig: LayoutConfig = layoutData;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Intro />
        <section className={styles.preview}>
          <Jobs />
          <Link href={config.sections.jobs.viewMoreLink} className={styles.viewMore}>
            {config.sections.jobs.viewMoreText}
          </Link>
        </section>
        <section className={styles.preview}>
          <Projects />
          <Link href={config.sections.projects.viewMoreLink} className={styles.viewMore}>
            {config.sections.projects.viewMoreText}
          </Link>
        </section>
        <section className={styles.preview}>
          <FeaturedCertifications />
          <Link href={config.sections.certifications.viewMoreLink} className={styles.viewMore}>
            {config.sections.certifications.viewMoreText}
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} {layoutConfig.footer.copyrightText}</span>
      </footer>
    </div>
  );
}
