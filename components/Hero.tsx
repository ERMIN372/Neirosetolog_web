"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-36 text-center md:pt-44"
    >
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan" />
        </span>
        На базе fal.ai · Kling Motion Control
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-4xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
      >
        Оживите любое фото
        <br />
        <span className="gradient-text bg-[length:200%_auto] animate-gradient-pan">
          движением из видео
        </span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-6 max-w-2xl text-balance text-lg text-white/70 md:text-xl"
      >
        Загрузите портрет и видео-референс — и герой на снимке точно повторит
        каждое движение, танец или жест. Без съёмок, без актёров, за пару минут.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <a href="#studio" className="btn-primary text-base !px-8 !py-4">
          ✨ Создать видео бесплатно
        </a>
        <a href="#how" className="btn-ghost text-base !px-8 !py-4">
          Как это работает
        </a>
      </motion.div>

      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/50"
      >
        <span className="flex items-center gap-2">
          <Check /> Фото → Видео
        </span>
        <span className="flex items-center gap-2">
          <Check /> Точный перенос движений
        </span>
        <span className="flex items-center gap-2">
          <Check /> HD-результат
        </span>
        <span className="flex items-center gap-2">
          <Check /> Ваши данные не сохраняются
        </span>
      </motion.div>
    </section>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-brand-cyan"
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
