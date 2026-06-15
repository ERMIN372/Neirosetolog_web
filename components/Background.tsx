export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Faint grid */}
      <div className="absolute inset-0 bg-grid-faint [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Aurora blobs */}
      <div className="aurora left-[-10%] top-[-10%] h-[42rem] w-[42rem] animate-float bg-brand-violet/40" />
      <div
        className="aurora right-[-10%] top-[10%] h-[38rem] w-[38rem] animate-float bg-brand-fuchsia/30"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="aurora bottom-[-15%] left-[20%] h-[40rem] w-[40rem] animate-float bg-brand-cyan/25"
        style={{ animationDelay: "3s" }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,15,0.9)_100%)]" />
    </div>
  );
}
