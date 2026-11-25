"use client";

import { useEffect, useState } from "react";
import CoverOverlay from "@/components/wedding/CoverOverlay";
import OpeningVideo from "@/components/wedding/OpeningVideo";
import CountdownSection from "@/components/wedding/CountdownSection";
import GallerySection from "@/components/wedding/GallerySection";
import MusicPlayer from "@/components/wedding/MusicPlayer";
import Reveal from "@/components/wedding/Reveal";
import { MEDIA } from "@/components/wedding/media";

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);

  // Mulai selalu dari atas halaman & matikan scroll restoration browser
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Setelah Open diklik, pastikan mulai dari slide 2 (paling atas)
  useEffect(() => {
    if (opened) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [opened]);

  // Kunci scroll selama cover (slide 1) tampil, buka setelah Open diklik
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [opened]);

  return (
    <div className="relative min-h-screen bg-[#39575e]">
      {/* Latar belakang dekoratif untuk area di luar kolom undangan (desktop) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 opacity-40"
        style={{
          backgroundImage: `url(${MEDIA.artBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Slide 1 — Cover video (hilang permanen setelah Open diklik) */}
      {!opened && <CoverOverlay onOpen={() => setOpened(true)} />}

      {/* Lagu latar — otomatis diputar saat slide 2 tampil, dengan tombol musik melayang */}
      <MusicPlayer active={opened} />

      {/* Konten undangan — slide 2 sampai 8, discroll smooth ke bawah */}
      <main
        aria-hidden={!opened}
        className="relative mx-auto w-full max-w-[430px] bg-[#f1f1ee] shadow-[0_0_60px_rgba(0,0,0,0.35)]"
      >
        {/* Slide 2 — Video pembuka (berhenti di detik akhir, tidak loop) */}
        <OpeningVideo active={opened} />

        {/* Slide 3 — Kutipan QS. Ar-Rum: 21 */}
        <section
          id="slide-3"
          className="w-full bg-[#39575e]"
          aria-label="Kutipan QS Ar-Rum ayat 21"
        >
          <Reveal>
            <img
              src={MEDIA.slide3}
              alt="Kutipan QS. Ar-Rum ayat 21 tentang tanda kebesaran Allah menciptakan pasangan"
              className="block w-full"
              loading="lazy"
            />
          </Reveal>
        </section>

        {/* Slide 4 — Mempelai: Maestro & Farida */}
        <section
          id="slide-4"
          className="w-full bg-[#eceee3]"
          aria-label="Mempelai Maestro dan Farida"
        >
          <Reveal>
            <img
              src={MEDIA.slide4}
              alt="Maestro, putra dari Bapak Arif & Ibu Dewi bersama Farida, putri dari Bapak Anto & Ibu Umi"
              className="block w-full"
              loading="lazy"
            />
          </Reveal>
        </section>

        {/* Slide 5 — Akad Nikah, Resepsi & countdown Save The Date */}
        <CountdownSection />

        {/* Slide 6 — Our Story */}
        <section
          id="slide-6"
          className="w-full bg-[#eceee3]"
          aria-label="Kisah kami"
        >
          <Reveal>
            <img
              src={MEDIA.slide6}
              alt="Our Story — awal bertamu, komitmen, dan lamaran Maestro & Farida"
              className="block w-full"
              loading="lazy"
            />
          </Reveal>
        </section>

        {/* Slide 7 — Our Gallery */}
        <GallerySection />

        {/* Slide 8 — Penutup */}
        <section
          id="slide-8"
          className="w-full bg-[#eceee3]"
          aria-label="Penutup undangan"
        >
          <Reveal>
            <img
              src={MEDIA.slide8}
              alt="Foto Maestro & Farida dengan ucapan terima kasih dan kesan serta pesan"
              className="block w-full"
              loading="lazy"
            />
          </Reveal>
        </section>
      </main>
    </div>
  );
}
