import styles from './page.module.css';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./Map'), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <DynamicMap />
    </main>
  );
}
