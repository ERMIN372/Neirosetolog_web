"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fal } from "@fal-ai/client";
import {
  MOTION_MODELS,
  ORIENTATIONS,
  getEndpoint,
  type QualityId,
  type CharacterOrientation,
  type MotionControlInput,
} from "@/lib/models";

// Route every fal request through our own server — the FAL_KEY never reaches the browser.
fal.config({ proxyUrl: "/api/fal/proxy" });

type Status = "idle" | "uploading" | "processing" | "done" | "error";

interface ResultVideo {
  video?: { url: string };
}

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp,image/gif,image/avif";
const ACCEPT_VIDEO = "video/mp4,video/quicktime,video/webm,video/x-m4v";
const MAX_IMAGE_MB = 15;
const MAX_VIDEO_MB = 120;

export default function Generator() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [orientation, setOrientation] =
    useState<CharacterOrientation>("video");
  const [quality, setQuality] = useState<QualityId>("standard");
  const [keepSound, setKeepSound] = useState(true);

  const [status, setStatus] = useState<Status>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const pushLog = useCallback((line: string) => {
    setLogs((prev) => [...prev.slice(-40), line]);
  }, []);

  const onPickImage = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Фото больше ${MAX_IMAGE_MB} МБ — выберите файл поменьше.`);
      return;
    }
    setError(null);
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const onPickVideo = (file: File | null) => {
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Видео больше ${MAX_VIDEO_MB} МБ — выберите файл поменьше.`);
      return;
    }
    setError(null);
    setVideoFile(file);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(URL.createObjectURL(file));
  };

  const busy = status === "uploading" || status === "processing";
  const canGenerate = !!imageFile && !!videoFile && !busy;

  const handleGenerate = async () => {
    if (!imageFile || !videoFile) return;
    setError(null);
    setResultUrl(null);
    setLogs([]);
    setStatus("uploading");

    try {
      pushLog("Загружаем фото и видео в облако fal.ai…");
      const [image_url, video_url] = await Promise.all([
        fal.storage.upload(imageFile),
        fal.storage.upload(videoFile),
      ]);
      pushLog("Файлы загружены ✓");

      const input: MotionControlInput = {
        image_url,
        video_url,
        character_orientation: orientation,
        keep_original_sound: keepSound,
      };
      if (prompt.trim()) input.prompt = prompt.trim();

      setStatus("processing");
      pushLog("Запускаем перенос движений…");

      const result = await fal.subscribe(getEndpoint(quality), {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_QUEUE") {
            pushLog(
              `В очереди${
                typeof update.queue_position === "number"
                  ? ` · позиция ${update.queue_position}`
                  : ""
              }…`,
            );
          } else if (update.status === "IN_PROGRESS") {
            const last = update.logs?.[update.logs.length - 1]?.message;
            pushLog(last ? `Генерация: ${last}` : "Генерация видео…");
          }
        },
      });

      const data = result.data as ResultVideo;
      const url = data?.video?.url;
      if (!url) throw new Error("Модель не вернула видео. Попробуйте ещё раз.");

      pushLog("Готово! 🎉");
      setResultUrl(url);
      setStatus("done");
    } catch (e: unknown) {
      const msg = extractError(e);
      setError(msg);
      setStatus("error");
      pushLog(`Ошибка: ${msg}`);
    }
  };

  const reset = () => {
    setStatus("idle");
    setResultUrl(null);
    setError(null);
    setLogs([]);
  };

  return (
    <section id="studio" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-violet">
          Студия
        </p>
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">
          Создайте видео <span className="gradient-text">прямо сейчас</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Загрузите фото героя и видео с движением — остальное сделает ИИ.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* ---- Left: inputs ---- */}
        <div className="card-glow space-y-6 !p-6 md:!p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Dropzone
              label="Фото героя"
              hint="JPG, PNG, WebP — до 15 МБ"
              accept={ACCEPT_IMAGE}
              onFile={onPickImage}
              preview={
                imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Превью фото"
                    className="h-full w-full object-cover"
                  />
                ) : null
              }
              filename={imageFile?.name}
              icon="🖼️"
            />
            <Dropzone
              label="Видео-референс"
              hint="MP4, MOV, WebM — до 120 МБ"
              accept={ACCEPT_VIDEO}
              onFile={onPickVideo}
              preview={
                videoPreview ? (
                  <video
                    src={videoPreview}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : null
              }
              filename={videoFile?.name}
              icon="🎬"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Подсказка{" "}
              <span className="font-normal text-white/40">(необязательно)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Напр.: девушка энергично танцует на сцене, кинематографичный свет"
              className="w-full resize-none rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand-violet/60 focus:ring-2 focus:ring-brand-violet/30"
            />
          </div>

          {/* Quality */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Качество
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {MOTION_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setQuality(m.id)}
                  className={`relative rounded-2xl border p-4 text-left transition ${
                    quality === m.id
                      ? "border-brand-violet bg-brand-violet/10 ring-2 ring-brand-violet/40"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.label}</span>
                    {m.badge && (
                      <span className="rounded-full bg-gradient-to-r from-brand-violet to-brand-fuchsia px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    {m.blurb}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Ориентация персонажа
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {ORIENTATIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOrientation(o.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    orientation === o.id
                      ? "border-brand-cyan bg-brand-cyan/10 ring-2 ring-brand-cyan/30"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <span className="font-semibold">{o.label}</span>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">
                    {o.hint}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Keep sound */}
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="text-sm">
              <span className="font-semibold">Сохранить оригинальный звук</span>
              <span className="block text-xs text-white/45">
                Берём звуковую дорожку из видео-референса
              </span>
            </span>
            <span
              role="switch"
              aria-checked={keepSound}
              tabIndex={0}
              onClick={() => setKeepSound((v) => !v)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                setKeepSound((v) => !v)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                keepSound ? "bg-brand-violet" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  keepSound ? "left-6" : "left-1"
                }`}
              />
            </span>
          </label>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary w-full text-base !py-4"
          >
            {busy ? (
              <>
                <Spinner /> Генерируем…
              </>
            ) : (
              <>✨ Сгенерировать видео</>
            )}
          </button>
        </div>

        {/* ---- Right: output ---- */}
        <div className="card-glow flex min-h-[420px] flex-col !p-6 md:!p-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Результат
          </h3>

          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              {status === "done" && resultUrl ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <video
                    src={resultUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full rounded-2xl ring-1 ring-white/10"
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={resultUrl}
                      download="neirosetolog.mp4"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary flex-1 !py-3"
                    >
                      ⬇ Скачать
                    </a>
                    <button onClick={reset} className="btn-ghost !py-3">
                      Новое видео
                    </button>
                  </div>
                </motion.div>
              ) : busy ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <div className="mx-auto mb-5 h-16 w-16">
                    <BigSpinner />
                  </div>
                  <p className="font-semibold">
                    {status === "uploading"
                      ? "Загружаем файлы…"
                      : "ИИ переносит движения…"}
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    Обычно занимает 1–3 минуты. Не закрывайте вкладку.
                  </p>

                  <div className="mt-6 max-h-40 overflow-y-auto rounded-2xl border border-white/10 bg-ink-950/60 p-4 text-left font-mono text-xs text-white/55">
                    {logs.map((l, i) => (
                      <div key={i} className="py-0.5">
                        <span className="text-brand-cyan">›</span> {l}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-violet/20 to-brand-fuchsia/20 text-4xl ring-1 ring-white/10">
                    🎥
                  </div>
                  <p className="text-white/60">
                    Здесь появится ваше видео
                  </p>
                  <p className="mt-1 text-sm text-white/35">
                    Загрузите фото и референс, чтобы начать
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Dropzone ---------- */
function Dropzone({
  label,
  hint,
  accept,
  onFile,
  preview,
  filename,
  icon,
}: {
  label: string;
  hint: string;
  accept: string;
  onFile: (file: File | null) => void;
  preview: React.ReactNode;
  filename?: string;
  icon: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-white/80">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
          drag
            ? "border-brand-violet bg-brand-violet/10"
            : "border-white/15 bg-ink-900/40 hover:border-white/30 hover:bg-white/[0.03]"
        }`}
      >
        {preview ? (
          <>
            {preview}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent p-3 opacity-0 transition group-hover:opacity-100">
              <span className="truncate text-xs text-white/90">
                {filename} · нажмите, чтобы заменить
              </span>
            </div>
          </>
        ) : (
          <div className="px-4 text-center">
            <div className="mb-2 text-3xl">{icon}</div>
            <p className="text-sm font-medium text-white/70">
              Перетащите или выберите
            </p>
            <p className="mt-1 text-xs text-white/40">{hint}</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

/* ---------- Spinners ---------- */
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BigSpinner() {
  return (
    <svg className="h-full w-full animate-spin" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2.5"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="url(#g)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Error helper ---------- */
function extractError(e: unknown): string {
  if (typeof e === "object" && e !== null) {
    const anyErr = e as {
      status?: number;
      message?: string;
      body?: { detail?: unknown };
    };
    if (anyErr.status === 401 || anyErr.status === 403) {
      return "Сервис не настроен: добавьте FAL_KEY в переменные окружения на Vercel.";
    }
    const detail = anyErr.body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length) {
      const first = detail[0] as { msg?: string };
      if (first?.msg) return first.msg;
    }
    if (anyErr.message) return anyErr.message;
  }
  return "Что-то пошло не так. Попробуйте ещё раз.";
}
