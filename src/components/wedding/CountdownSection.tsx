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
      className="relative w-full bg-[#3f6a76]"
      aria-label="Save the date"
    >
      <div className="relative w-full">
        {/* Gambar berisi Akad Nikah, Resepsi, dan judul Save The Date */}
        <img
          src={MEDIA.event}
          alt="Akad Nikah dan Resepsi — Sabtu, 10 Juli 2027, Pademangan, Jakarta Utara"
          className="block w-full"
          loading="lazy"
        />

        {/* Countdown fungsional yang tepat menutupi kotak pada gambar.
            Posisi diukur dari gambar asli: kotak dari 85.42% - 94.76% vertikal,
            kolom dari 6.11% - 93.78% horizontal. */}
        <Reveal className="absolute left-[6.11%] top-[85.42%] h-[9.34%] w-[87.67%]">
          <div className="grid h-full grid-cols-4 gap-x-[8.5%]">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center gap-[8%] rounded-[8px] bg-[#b2c1c8] text-white shadow-sm"
                aria-label={`${item.value} ${item.label}`}
              >
                <span className="font-display text-[clamp(17px,5.2vw,26px)] font-semibold leading-none tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(9px,2.9vw,14px)] leading-none">
                  {item.label}
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
