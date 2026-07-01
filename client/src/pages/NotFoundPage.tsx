import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/landing/AnimatedBackground";
import { ROUTES } from "@/constants/routes";

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A0A0F] px-6 text-white">
      <AnimatedBackground />

      <main className="relative z-10 animate-fade-in text-center">
        <p
          className="text-8xl font-semibold tracking-tighter text-white/10 sm:text-9xl"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          to={ROUTES.APP_HOME}
          className="focus-ring group mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/15"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to home
        </Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
