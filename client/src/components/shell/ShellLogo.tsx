import { APP_NAME } from "@/constants/app";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type ShellLogoProps = WithClassName & {
  size?: "sm" | "md";
};

export function ShellLogo({ className, size = "md" }: ShellLogoProps) {
  const iconSize = size === "sm" ? "size-7" : "size-8";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      aria-label={APP_NAME}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/[0.08] transition-transform hover:scale-[1.04]",
          iconSize,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" fill="url(#shell-logo-gradient)" />
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="url(#shell-logo-gradient)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <defs>
            <linearGradient
              id="shell-logo-gradient"
              x1="4"
              y1="4"
              x2="20"
              y2="20"
            >
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={cn("font-medium tracking-tight text-white/90", textSize)}>
        {APP_NAME}
      </span>
    </div>
  );
}
