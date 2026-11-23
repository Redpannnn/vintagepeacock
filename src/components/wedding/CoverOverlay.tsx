"use client";

import { useEffect, useRef, useState } from "react";
import { MailOpen } from "lucide-react";
import { MEDIA } from "./media";

interface CoverOverlayProps {
  onOpen: () => void;
}

export default function CoverOverlay({ onOpen }: CoverOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [canOpen, setCanOpen] = useState(false);
  const everPlayedRef = useRef(false);

  // Cadangan: bila autoplay diblokir browser atau video gagal dimuat,
  // tombol Open tetap ditampilkan agar tamu tidak terjebak di cover.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!everPlayedRef.current) setCanOpen(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (leaving) return;
    setLeaving(true);
    // Tunggu animasi fade-out selesai lalu unmount (slide 1 tidak muncul lagi)
    window.setTimeout(onOpen, 750);
  };

  return (
    <div
      aria-hidden={leaving}
      className={`fixed inset-0 z-[60] bg-[#39575e] transition-opacity duration-700 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Undangan pernikahan Maestro & Farida"
    >
      {/* Kolom undangan (mirroring layout konten) */}
      <div className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden">
        <video
          ref={videoRef}
          src={MEDIA.coverVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            everPlayedRef.current = true;
            const v = videoRef.current;
            // Saat video mendekati akhir (0,5 detik terakhir), tampilkan tombol
            if (v && v.duration > 0 && v.duration - v.currentTime <= 0.5) {
              setCanOpen(true);
            }
          }}
          onEnded={() => setCanOpen(true)}
          onError={() => setCanOpen(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient halus di bawah agar tombol kontras */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#39575e]/85" />

        {/* Tombol Open — hanya muncul setelah video cover diputar sampai akhir */}
        {canOpen && (
          <div className="absolute inset-x-0 bottom-[6%] z-10 flex flex-col items-center gap-3 px-6">
            <button
              type="button"
              onClick={handleOpen}
              className={`animate-soft-pulse-ring group flex items-center gap-2.5 rounded-full bg-[#39575e] px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-xl ring-1 ring-white/30 transition-all duration-300 hover:scale-[1.04] hover:bg-[#2e4a51] active:scale-95 ${
                leaving ? "opacity-0" : "animate-fade-in-up"
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              <MailOpen
                className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                aria-hidden="true"
              />
              Open
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
