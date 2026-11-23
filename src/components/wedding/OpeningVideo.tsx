"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { MEDIA } from "./media";
import { MUSIC_PLAYING_EVENT } from "./MusicPlayer";

interface OpeningVideoProps {
  /** true ketika tombol Open di cover sudah diklik */
  active: boolean;
}

export default function OpeningVideo({ active }: OpeningVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  // Autoplay video (tanpa suara) saat undangan dibuka — lagu latar yang berbunyi
  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* video akan tampil sebagai poster sampai bisa diputar */
    });
  }, [active]);

  // Ketika lagu latar mulai berbunyi, pastikan suara video tetap mute agar
  // tidak bertabrakan. Tombol suara video tetap berfungsi bila user ingin
  // menyalakan suara video secara manual.
  useEffect(() => {
    const onMusicPlaying = () => {
      const video = videoRef.current;
      if (video) {
        video.muted = true;
      }
      setSoundOn(false);
    };
    window.addEventListener(MUSIC_PLAYING_EVENT, onMusicPlaying);
    return () =>
      window.removeEventListener(MUSIC_PLAYING_EVENT, onMusicPlaying);
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setSoundOn(!video.muted);
    if (!video.muted && video.paused) {
      video.play().catch(() => {});
    }
  };

  return (
    <section
      id="slide-2"
      className="relative w-full bg-[#39575e]"
      aria-label="Video pembuka"
    >
      <div className="relative w-full">
        <video
          ref={videoRef}
          src={MEDIA.openingVideo}
          poster="/poster-slide2.jpg"
          playsInline
          preload="auto"
          muted
          /* Tanpa loop — ketika durasi habis, video berhenti di detik akhir */
          className="block aspect-[964/1716] w-full bg-[#39575e] object-cover"
        />

        {/* Tombol kontrol suara video */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? "Matikan suara video" : "Nyalakan suara video"}
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95"
        >
          {soundOn ? (
            <Volume2 className="size-4.5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-4.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
}
