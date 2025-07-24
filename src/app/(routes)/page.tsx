import Image from "next/image";
import styles from "@/styles/page.module.css";
import MainSection from "@/components/MainSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <MainSection />
        </div>
      </main>
    </div>
  );
}
