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
  const [ready, setReady] = useState(false);

  // Tombol Open muncul halus sesaat setelah cover tampil,
  // dan tetap tampil walau video gagal dimuat agar tamu tidak terjebak di cover.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1200);
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
      className={`fixed inset-0 z-[60] bg-[#eceee3] transition-opacity duration-700 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Undangan pernikahan Maestro & Farida"
    >
      {/* Kolom undangan (mirroring layout konten) */}
      <div className="absolute inset-0 mx-auto w-full max-w-[430px]">
        {/* Kotak video dengan rasio asli 964:1772 — menjaga posisi nama mempelai
            pada video selalu konsisten di semua ukuran layar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative aspect-[964/1772] h-full max-w-full">
            <video
              ref={videoRef}
              src={MEDIA.coverVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              onError={() => setReady(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Tombol Open kecil — tepat di bawah nama mempelai pada video
                (teks "Maestro & Farida" berakhir di ~67% tinggi video) */}
            <div
              className={`absolute inset-x-0 top-[69%] z-10 flex justify-center transition-opacity duration-700 ${
                ready && !leaving ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={handleOpen}
                className="animate-soft-pulse-ring group flex items-center gap-1.5 rounded-full bg-[#39575e] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg ring-1 ring-white/40 transition-all duration-300 hover:scale-105 hover:bg-[#2e4a51] active:scale-95"
              >
                <MailOpen
                  className="size-3.5 transition-transform duration-300 group-hover:-rotate-6"
                  aria-hidden="true"
                />
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
