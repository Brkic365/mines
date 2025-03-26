"use client";

import React, { useCallback, useEffect } from "react";
import styles from "@/styles/components/Navbar.module.scss";

import { IoIosArrowBack } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation";
import { useWalletStore } from "../hooks/useWalletStore";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const balance = useWalletStore((s) => s.balance);
  const currency = useWalletStore((s) => s.currency);
  const loadBalance = useWalletStore((s) => s.loadBalance);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <section className={styles.navbar}>
      {pathname !== "/" && (
        <IoIosArrowBack onClick={handleBack} className={styles.backIcon} />
      )}

      <section className={styles.balance}>
        <span>BALANCE</span>
        <p>
          {balance.toFixed(2)} {currency || ""}
        </p>
      </section>
    </section>
  );
}

export default Navbar;
