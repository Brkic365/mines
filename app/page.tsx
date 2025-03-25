"use client"

import Image from "next/image";
import styles from "@/styles/pages/Home.module.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/game">GO HERE</Link>
    </div>
  );
}
