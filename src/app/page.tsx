import styles from "./page.module.css";
import Intro from "./sections/Intro/Intro";
import FeaturedCertifications from "./sections/FeaturedCertifications";
import Jobs from "./jobs/Jobs";
import Projects from "./projects/Projects";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>

      <main className={styles.main}>
        <Intro />
        <section className={styles.preview}>
          <Jobs />
          <Link href="/jobs" className={styles.viewMore}>
            View All Experience
          </Link>
        </section>
        <section className={styles.preview}>
          <Projects />
          <Link href="/projects" className={styles.viewMore}>
            View All Projects
          </Link>
        </section>
        <section className={styles.preview}>
          <FeaturedCertifications />
          <Link href="/certifications" className={styles.viewMore}>
            View All Certifications
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Ad. All rights reserved.</span>
      </footer>
    </div>
  );
}
