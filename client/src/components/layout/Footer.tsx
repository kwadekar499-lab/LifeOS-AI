export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full px-6 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <p className="text-xs text-white/30">
          © {year} LifeOS AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
