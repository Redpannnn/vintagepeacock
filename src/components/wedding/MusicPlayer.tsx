"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";

interface MusicPlayerProps {
  /** true ketika tombol Open di cover sudah diklik (slide 2 tampil) */
  active: boolean;
}

const MUSIC_PLAYING_EVENT = "wedding:music-playing";

export default function MusicPlayer({ active }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setPlaying(true);
      // Beri tahu komponen lain (mis. video slide 2) bahwa musik sedang berbunyi
      window.dispatchEvent(new CustomEvent(MUSIC_PLAYING_EVENT));
    };
    const onPause = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // Autoplay saat undangan dibuka — dijalankan tepat setelah gesture klik "Open"
  useEffect(() => {
    if (!active) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.play().catch(() => {
      /* browser menolak autoplay — user bisa menyalakan lewat tombol */
    });
  }, [active]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/azure-default.mp3"
        loop
        preload="auto"
        className="hidden"
      />

      {/* Tombol musik melayang — hanya muncul setelah undangan dibuka */}
      {active && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
          className="fixed right-4 top-4 z-50 flex size-11 items-center justify-center rounded-full bg-[#39575e]/85 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-[#39575e] active:scale-95"
        >
          <Disc3
            className={`size-5 ${playing ? "animate-[spin_4s_linear_infinite]" : ""}`}
            aria-hidden="true"
          />
          {!playing && (
            <span
              className="absolute h-px w-6 rotate-45 bg-white/90"
              aria-hidden="true"
            />
          )}
        </button>
      )}
    </>
  );
}

export { MUSIC_PLAYING_EVENT };
