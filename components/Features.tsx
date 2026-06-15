"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Точный перенос движений",
    text: "Танцы, спорт, жесты, мимика — модель Kling Motion Control повторяет даже сложную хореографию.",
    icon: "🕺",
  },
  {
    title: "Любой герой",
    text: "Реальные люди, персонажи, аватары. Достаточно одного качественного фото.",
    icon: "🧑‍🎤",
  },
  {
    title: "Ориентация на выбор",
    text: "Следуйте за видео для сложного движения или за фото — чтобы сохранить исходную позу и ракурс.",
    icon: "🎯",
  },
  {
    title: "Оригинальный звук",
    text: "По желанию сохраняем звуковую дорожку из видео-референса в финальном ролике.",
    icon: "🔊",
  },
  {
    title: "HD-качество",
    text: "Режим Pro выдаёт максимальную детализацию для публикаций и рекламы.",
    icon: "💎",
  },
  {
    title: "Готово к Vercel",
    text: "Молниеносный фронтенд и безопасный серверный прокси — ключ API не попадает в браузер.",
    icon: "🚀",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-fuchsia">
          Возможности
        </p>
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">
          Всё для <span className="gradient-text">вирусного контента</span>
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            className="card-glow group hover:-translate-y-1 hover:border-white/20"
          >
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10 transition-transform group-hover:scale-110">
              {f.icon}
            </div>
            <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
