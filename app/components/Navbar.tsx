"use client"

import React from 'react'
import styles from "@/styles/components/Navbar.module.scss"

import { IoIosArrowBack } from "react-icons/io";

import { useRouter } from 'next/navigation';
import { useStore } from '../hooks/useStore';

function Navbar() {

    const router = useRouter();

    const balance = useStore((s) => s.balance);

  return (
    <section className={styles.navbar}>
        <IoIosArrowBack onClick={() => router.back()}/>
        <section className={styles.balance}>
            <span>BALANCE</span>
            <p>${balance.toFixed(2)}</p>
        </section>
    </section>
  )
}

export default Navbar