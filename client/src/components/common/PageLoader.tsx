export function PageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0A0A0F]"
      role="status"
      aria-label="Loading page"
    >
      <div
        className="size-5 animate-spin rounded-full border-2 border-white/10 border-t-white/70"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
