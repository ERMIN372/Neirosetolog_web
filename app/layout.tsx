import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://neirosetolog.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Neirosetolog — AI Motion Studio",
    template: "%s · Neirosetolog",
  },
  description:
    "Оживите любое фото. Загрузите портрет и видео-референс — и человек на снимке повторит каждое движение. ИИ-студия видео на базе fal.ai Motion Control.",
  keywords: [
    "ИИ видео",
    "AI motion control",
    "оживить фото",
    "motion transfer",
    "fal.ai",
    "Kling",
    "нейросеть видео",
  ],
  authors: [{ name: "Neirosetolog" }],
  openGraph: {
    title: "Neirosetolog — AI Motion Studio",
    description:
      "Загрузите фото и видео-референс — ИИ заставит героя на снимке повторить движения.",
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Neirosetolog — AI Motion Studio",
    description:
      "Оживите фото движением из любого видео. ИИ-студия на базе fal.ai.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-ink-950 text-white antialiased selection:bg-brand-fuchsia/40 selection:text-white">
        {children}
      </body>
    </html>
  );
}
