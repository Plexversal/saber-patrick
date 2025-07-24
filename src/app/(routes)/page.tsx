import Image from "next/image";
import styles from "@/styles/page.module.css";
import MainSection from "@/components/MainSection";
import SidePanel from "@/components/SidePanel";
import { RegexProvider } from "@/context/RegexContext";

export default function Home() {
  return (
    <RegexProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          <div>
            <MainSection />
            <br></br>
            <SidePanel />
          </div>
        </main>
      </div>
    </RegexProvider>
  );
}
