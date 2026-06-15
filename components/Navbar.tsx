"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#studio", label: "Студия" },
  { href: "#how", label: "Как это работает" },
  { href: "#features", label: "Возможности" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <div
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-2xl" : ""
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-fuchsia text-lg font-black shadow-lg">
              N
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-violet to-brand-fuchsia blur-md opacity-50" />
            </span>
            <span className="text-base font-bold tracking-tight">
              Neiro<span className="gradient-text">setolog</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#studio" className="btn-primary !px-5 !py-2">
            Создать видео
          </a>
        </div>
      </div>
    </header>
  );
}
