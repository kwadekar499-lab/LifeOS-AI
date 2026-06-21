import { memo } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type PlaceholderPageProps = WithClassName & {
  title: string;
  subtitle: string;
  icon: ReactNode;
};

export const PlaceholderPage = memo(function PlaceholderPage({
  title,
  subtitle,
  icon,
  className,
}: PlaceholderPageProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      <div
        className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.06]"
        aria-hidden="true"
      >
        <div className="text-white/40 [&>svg]:size-6">{icon}</div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
        {subtitle}
      </p>

      <div className="mt-10 w-full max-w-sm rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-8">
        <p className="text-xs font-medium uppercase tracking-wider text-white/25">
          Coming soon
        </p>
        <p className="mt-2 text-sm text-white/35">
          This module is part of the LifeOS framework and will be available in a
          future release.
        </p>
      </div>
    </article>
  );
});
