"use client";

import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Загрузите фото",
    text: "Портрет героя в полный или поясной рост. Чёткое тело, без перекрытий — занимает больше 5% кадра.",
    icon: "🖼️",
  },
  {
    n: "02",
    title: "Добавьте видео-референс",
    text: "Любой ролик с движением: танец, жесты, проходка. Именно эти движения повторит ваш герой.",
    icon: "🎬",
  },
  {
    n: "03",
    title: "Получите готовое видео",
    text: "ИИ переносит движения на ваше фото и отдаёт готовый клип, который можно сразу скачать.",
    icon: "⚡",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mb-14 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
          Три шага
        </p>
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">
          Как это работает
        </h2>
      </div>

      <div className="relative grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.12 }}
            className="card-glow group hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-fuchsia/20 text-3xl ring-1 ring-white/10">
                {s.icon}
              </span>
              <span className="text-5xl font-black text-white/5 transition-colors group-hover:text-white/10">
                {s.n}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
