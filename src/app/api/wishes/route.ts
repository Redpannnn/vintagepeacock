import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ATTENDANCE = ["HADIR", "TIDAK_HADIR", "MASIH_RAGU"] as const;

const wishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(60, "Nama maksimal 60 karakter"),
  attendance: z.enum(ATTENDANCE),
  message: z
    .string()
    .trim()
    .min(1, "Ucapan wajib diisi")
    .max(500, "Ucapan maksimal 500 karakter"),
});

export type Attendance = (typeof ATTENDANCE)[number];

export async function GET() {
  try {
    const wishes = await db.wish.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const [hadir, tidakHadir, ragu] = await Promise.all([
      db.wish.count({ where: { attendance: "HADIR" } }),
      db.wish.count({ where: { attendance: "TIDAK_HADIR" } }),
      db.wish.count({ where: { attendance: "MASIH_RAGU" } }),
    ]);

    return NextResponse.json({
      wishes,
      stats: { hadir, tidakHadir, ragu, total: hadir + tidakHadir + ragu },
    });
  } catch (error) {
    console.error("GET /api/wishes error:", error);
    return NextResponse.json(
      { error: "Gagal memuat ucapan" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = wishSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Data tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const wish = await db.wish.create({
      data: parsed.data,
    });

    return NextResponse.json({ wish }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishes error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim ucapan" },
      { status: 500 }
    );
  }
}
