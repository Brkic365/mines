"use client"

import Image from "next/image";
import styles from "@/styles/pages/Home.module.scss";
import Link from "next/link";

import { IoIosArrowForward } from "react-icons/io";

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className={styles.page}>
      <button onClick={() => router.push("/game")}>
        <p>Mines</p>
        <IoIosArrowForward />
      </button>
    </div>
  );
}
