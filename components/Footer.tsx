export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-violet to-brand-fuchsia text-sm font-black">
            N
          </span>
          <span className="font-bold">
            Neiro<span className="gradient-text">setolog</span>
          </span>
        </div>

        <p className="text-center text-sm text-white/40">
          ИИ-студия видео · Motion Control на базе{" "}
          <a
            href="https://fal.ai"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            fal.ai
          </a>
        </p>

        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Neirosetolog
        </p>
      </div>
    </footer>
  );
}
