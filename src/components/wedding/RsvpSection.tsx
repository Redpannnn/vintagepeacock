"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, MessageCircleHeart, Send } from "lucide-react";
import { toast } from "sonner";
import { MEDIA } from "./media";
import Reveal from "./Reveal";

type Attendance = "HADIR" | "TIDAK_HADIR" | "MASIH_RAGU";

interface Wish {
  id: string;
  name: string;
  attendance: Attendance;
  message: string;
  createdAt: string;
}

interface Stats {
  hadir: number;
  tidakHadir: number;
  ragu: number;
  total: number;
}

const ATTENDANCE_OPTIONS: { value: Attendance; label: string }[] = [
  { value: "HADIR", label: "Hadir" },
  { value: "TIDAK_HADIR", label: "Tidak Hadir" },
  { value: "MASIH_RAGU", label: "Masih Ragu" },
];

const ATTENDANCE_BADGE: Record<Attendance, { label: string; className: string }> = {
  HADIR: {
    label: "Hadir",
    className: "bg-[#39575e] text-white",
  },
  TIDAK_HADIR: {
    label: "Tidak Hadir",
    className: "bg-[#a5484a]/10 text-[#a5484a] ring-1 ring-[#a5484a]/30",
  },
  MASIH_RAGU: {
    label: "Masih Ragu",
    className: "bg-[#b58a3c]/10 text-[#96702a] ring-1 ring-[#b58a3c]/30",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RsvpSection() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("HADIR");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/wishes", { cache: "no-store" });
      if (!res.ok) throw new Error("gagal memuat");
      const data = await res.json();
      setWishes(data.wishes ?? []);
      setStats(data.stats ?? null);
    } catch {
      toast.error("Gagal memuat ucapan. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!name.trim() || !message.trim()) {
      toast.error("Mohon isi nama dan ucapan terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal mengirim ucapan.");
        return;
      }

      toast.success("Terima kasih! Ucapan Anda telah terkirim.");
      setMessage("");
      await fetchWishes();
    } catch {
      toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="slide-8"
      className="relative w-full overflow-hidden px-6 py-14"
      aria-label="RSVP dan ucapan"
      style={{
        backgroundImage: `url(${MEDIA.wishBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#f4f1ea]/30" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[380px]">
        <Reveal>
          <h2 className="text-center font-display text-[32px] font-semibold text-white">
            RSVP
          </h2>
          <p className="mt-3 whitespace-nowrap text-center font-display text-[12.5px] italic leading-relaxed text-white sm:text-[15px]">
            Kehadiran dan doa restu Anda sangat berarti bagi kami.
          </p>
        </Reveal>

        {/* Form RSVP */}
        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl bg-white/80 p-5 shadow-[0_10px_30px_rgba(57,87,94,0.18)] ring-1 ring-white/70 backdrop-blur-sm"
          >
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-name" className="text-[13px] text-[#39575e]">
                Nama
              </Label>
              <Input
                id="rsvp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                maxLength={60}
                className="h-10 border-[#39575e]/25 bg-white/90 text-[14px] focus-visible:ring-[#39575e]/40"
              />
            </div>

            <div className="mt-4 space-y-1.5">
              <Label className="text-[13px] text-[#39575e]">Kehadiran</Label>
              <RadioGroup
                value={attendance}
                onValueChange={(v) => setAttendance(v as Attendance)}
                className="flex flex-row items-center gap-3 pt-0.5"
              >
                {ATTENDANCE_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-1.5">
                    <RadioGroupItem
                      value={opt.value}
                      id={`att-${opt.value}`}
                      className="border-[#39575e]/40 text-[#39575e]"
                    />
                    <Label
                      htmlFor={`att-${opt.value}`}
                      className="cursor-pointer text-[13px] font-normal text-[#4b5e62]"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label htmlFor="rsvp-message" className="text-[13px] text-[#39575e]">
                Ucapan & Doa
              </Label>
              <Textarea
                id="rsvp-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                rows={4}
                maxLength={500}
                className="resize-none border-[#39575e]/25 bg-white/90 text-[14px] focus-visible:ring-[#39575e]/40"
              />
              <p className="text-right text-[11px] text-[#5c6b6e]/70">
                {message.length}/500
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 w-full gap-2 rounded-full bg-[#39575e] text-[14px] font-semibold tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#2e4a51] hover:shadow-lg active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  Kirim Ucapan
                </>
              )}
            </Button>
          </form>
        </Reveal>

        {/* Statistik kehadiran */}
        {stats && stats.total > 0 && (
          <Reveal delay={0.12}>
            <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-[#4b5e62]">
              <span className="rounded-full bg-[#39575e] px-3 py-1 font-medium text-white">
                {stats.hadir} Hadir
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-[#a5484a] ring-1 ring-[#a5484a]/25">
                {stats.tidakHadir} Tidak Hadir
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-[#96702a] ring-1 ring-[#b58a3c]/30">
                {stats.ragu} Ragu
              </span>
            </div>
          </Reveal>
        )}

        {/* Daftar ucapan tamu */}
        <Reveal delay={0.15}>
          <div className="mt-6">
            <h3 className="flex items-center justify-center gap-2 font-display text-lg font-semibold text-[#39575e]">
              <MessageCircleHeart className="size-4.5" aria-hidden="true" />
              Ucapan & Doa
            </h3>

            <div
              className="custom-scrollbar mt-4 max-h-96 space-y-3 overflow-y-auto rounded-2xl p-1.5 pr-2.5"
              role="list"
              aria-label="Daftar ucapan tamu"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-white/70 py-10 text-[13px] text-[#5c6b6e]">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Memuat ucapan...
                </div>
              ) : wishes.length === 0 ? (
                <div className="rounded-xl bg-white/70 py-10 text-center text-[13px] italic text-[#5c6b6e]">
                  Belum ada ucapan.
                  <br />
                  Jadilah yang pertama mengirim doa!
                </div>
              ) : (
                wishes.map((wish) => {
                  const badge = ATTENDANCE_BADGE[wish.attendance] ?? ATTENDANCE_BADGE.HADIR;
                  return (
                    <article
                      key={wish.id}
                      role="listitem"
                      className="rounded-xl bg-white/80 p-3.5 shadow-sm ring-1 ring-white/60"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-full bg-[#39575e]/10 font-display text-[12px] font-bold text-[#39575e]">
                            {wish.name.trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="font-display text-[14px] font-semibold text-[#31474c]">
                            {wish.name}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[#4b5e62]">
                        {wish.message}
                      </p>
                      <time className="mt-1.5 block text-[10.5px] text-[#5c6b6e]/70">
                        {formatDate(wish.createdAt)}
                      </time>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
