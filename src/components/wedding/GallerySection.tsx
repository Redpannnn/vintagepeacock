"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES, MEDIA } from "./media";
import Reveal from "./Reveal";

export default function GallerySection() {
  const [index, setIndex] = useState(0);
  const total = GALLERY_IMAGES.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section
      id="slide-7"
      className="relative w-full overflow-hidden px-6 py-14"
      aria-label="Galeri pernikahan"
      style={{
        backgroundImage: `url(${MEDIA.artBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Lapisan lembut agar konten terbaca */}
      <div className="absolute inset-0 bg-[#f4f1ea]/35" aria-hidden="true" />

      <div className="relative">
        <Reveal>
          <h2 className="text-center font-display text-[32px] font-semibold text-[#39575e]">
            Our Gallery
          </h2>
          <div
            className="mx-auto mt-3 h-px w-24 bg-[#39575e]/40"
            aria-hidden="true"
          />
        </Reveal>

        {/* Preview besar dengan tombol panah next / prev */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-7 aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(57,87,94,0.35)] ring-1 ring-white/60">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={GALLERY_IMAGES[index]}
                alt={`Galeri pernikahan ${index + 1} dari ${total}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Panah prev */}
            <button
              type="button"
              onClick={prev}
              aria-label="Gambar sebelumnya"
              className="absolute left-2.5 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#39575e] shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            {/* Panah next */}
            <button
              type="button"
              onClick={next}
              aria-label="Gambar berikutnya"
              className="absolute right-2.5 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#39575e] shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>

            {/* Indikator posisi */}
            <span className="absolute bottom-2.5 right-2.5 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {index + 1} / {total}
            </span>
          </div>
        </Reveal>

        {/* Preview kecil — klik untuk tampil di preview besar */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-5 grid w-full max-w-[340px] grid-cols-4 gap-2.5">
            {GALLERY_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Tampilkan gambar ${i + 1}`}
                aria-pressed={i === index}
                className={`aspect-square w-full overflow-hidden rounded-xl transition-all duration-300 ${
                  i === index
                    ? "opacity-100 ring-2 ring-[#39575e] ring-offset-2 ring-offset-[#f4f1ea]"
                    : "opacity-60 ring-1 ring-white/50 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`Thumbnail galeri ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
