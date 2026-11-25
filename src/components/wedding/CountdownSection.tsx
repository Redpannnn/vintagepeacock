"use client";

import { useEffect, useMemo, useState } from "react";
import { MEDIA, WEDDING_DATE_ISO } from "./media";
import Reveal from "./Reveal";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function getRemaining(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    passed: diff <= 0,
  };
}

const INITIAL: Remaining = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  passed: false,
};

export default function CountdownSection() {
  const targetMs = useMemo(() => new Date(WEDDING_DATE_ISO).getTime(), []);
  // Mulai dari 0 agar SSR & client render identik (bebas hydration mismatch)
  const [time, setTime] = useState<Remaining>(INITIAL);

  useEffect(() => {
    const update = () => setTime(getRemaining(targetMs));
    // Update pertama lewat rAF (bukan sinkron di body effect) + interval tiap detik
    const raf = requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [targetMs]);

  const items = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <section
      id="slide-5"
      className="relative w-full bg-[#39575e]"
      aria-label="Akad nikah, resepsi, dan save the date"
    >
      <div className="relative w-full">
        {/* Gambar berisi Akad Nikah, Resepsi, dan kotak Save The Date */}
        <img
          src={MEDIA.slide5}
          alt="Akad Nikah dan Resepsi — Sabtu, 10 Juli 2027, Pademangan, Jakarta Utara"
          className="block w-full"
          loading="lazy"
        />

        {/* Angka countdown yang tepat menutupi kotak kosong pada gambar
            (label Hari/Jam/Menit/Detik sudah tercetak di gambar).
            Posisi diukur dari gambar asli 965x2271:
            kotak dari 85.47% - 94.80% vertikal, kolom dari 6.22% - 93.89% horizontal. */}
        <Reveal className="absolute left-[6.22%] top-[85.47%] h-[9.33%] w-[87.67%]">
          <div className="grid h-full grid-cols-4 gap-x-[8.5%]">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-center pt-[12%]"
                aria-label={`${item.value} ${item.label}`}
              >
                <span className="font-display text-[clamp(18px,5.6vw,28px)] font-semibold leading-none tabular-nums text-white [text-shadow:0_1px_8px_rgba(57,87,94,0.45)]">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {time.passed && (
        <p className="pb-6 pt-3 text-center font-display text-sm italic text-white/85">
          Hari bahagia telah tiba, terima kasih atas doa restunya.
        </p>
      )}
    </section>
  );
}
