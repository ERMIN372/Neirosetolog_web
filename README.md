# Neirosetolog — AI Motion Studio 🎬

Стильная ИИ-студия для создания видео: загружаете **фото героя** и **видео-референс**, а человек на снимке **повторяет движения** из видео. Под капотом — модель **Kling Motion Control** от [fal.ai](https://fal.ai).

Готово к деплою на **Vercel** одним кликом.

![stack](https://img.shields.io/badge/Next.js-14-black) ![stack](https://img.shields.io/badge/Tailwind-3-38bdf8) ![stack](https://img.shields.io/badge/fal.ai-Motion%20Control-8b5cf6)

---

## ✨ Что умеет

- **Перенос движений (motion control)** — фото + видео → новое видео, где герой повторяет движения.
- Выбор качества: **Standard** (быстро) и **Pro** (максимальная детализация).
- Ориентация персонажа: *за видео* (сложное движение) или *за фото* (сохранить позу/ракурс).
- Сохранение оригинального звука из референса.
- Drag-and-drop загрузка, живые превью, лог генерации в реальном времени, скачивание результата.
- Безопасно: ключ `FAL_KEY` живёт только на сервере (через прокси `/api/fal/proxy`) и **не попадает в браузер**.

## 🧱 Стек

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- [`@fal-ai/client`](https://www.npmjs.com/package/@fal-ai/client) + [`@fal-ai/server-proxy`](https://www.npmjs.com/package/@fal-ai/server-proxy)

## 🚀 Локальный запуск

```bash
# 1. Установить зависимости
npm install

# 2. Создать .env.local и вписать свой ключ fal.ai
cp .env.example .env.local
#   FAL_KEY="key_id:key_secret"   ← взять на https://fal.ai/dashboard/keys

# 3. Запустить
npm run dev
```

Откройте http://localhost:3000

## ☁️ Деплой на Vercel

1. Запушьте репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → **Add New… → Project** → импортируйте репозиторий.
3. В **Settings → Environment Variables** добавьте:
   - `FAL_KEY` = `ваш_key_id:ваш_key_secret`
   > Без префикса `NEXT_PUBLIC_` — ключ должен остаться серверным.
4. **Deploy**. Готово 🎉

Vercel сам определит Next.js, ничего дополнительно настраивать не нужно.

## 🔌 Какая модель используется

| Качество | Endpoint fal.ai |
| --- | --- |
| Standard | `fal-ai/kling-video/v2.6/standard/motion-control` |
| Pro | `fal-ai/kling-video/v2.6/pro/motion-control` |

Эндпоинты и параметры собраны в [`lib/models.ts`](./lib/models.ts) — там же легко сменить версию модели (например, на `v3`) или поля ввода.

**Входные параметры:** `image_url` (фото), `video_url` (референс), `character_orientation` (`video`/`image`), `prompt` (опц.), `keep_original_sound`.

## 📁 Структура

```
app/
  layout.tsx              # метаданные, шрифт, глобальные стили
  page.tsx                # сборка лендинга + студии
  globals.css             # стили/утилиты Tailwind
  api/fal/proxy/route.ts  # серверный прокси к fal.ai (защита ключа)
components/
  Generator.tsx           # ядро: загрузка файлов и запуск модели
  Hero / Navbar / Features / HowItWorks / Footer / Background
lib/
  models.ts               # конфигурация моделей и параметров
```

## ⚠️ Заметки

- Генерация занимает 1–3 минуты — вкладку лучше не закрывать.
- Лучшее качество: чёткое фото в полный/поясной рост, тело без перекрытий; в референсе виден весь корпус.
- Расход кредитов fal.ai зависит от модели и длительности — см. тарифы на fal.ai.

---

Сделано с ❤️ для быстрого создания ИИ-контента.
