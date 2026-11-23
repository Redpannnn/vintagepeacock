import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Wedding of Maestro & Farida",
  description:
    "Undangan pernikahan Maestro & Farida — Sabtu, 10 Juli 2027 di Pademangan, Jakarta Utara. Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
  keywords: [
    "undangan pernikahan",
    "wedding invitation",
    "Maestro & Farida",
    "undangan digital",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "The Wedding of Maestro & Farida",
    description:
      "Undangan pernikahan Maestro & Farida — Sabtu, 10 Juli 2027, Pademangan, Jakarta Utara.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${greatVibes.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
