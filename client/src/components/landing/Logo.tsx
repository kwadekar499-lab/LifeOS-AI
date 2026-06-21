import { motion } from "framer-motion";
import { APP_NAME } from "@/constants/app";
import { cn } from "@/utils/cn";
import type { WithClassName } from "@/types";

type LogoProps = WithClassName & {
  size?: "sm" | "md";
};

export function Logo({ className, size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "size-7" : "size-8";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={cn("flex items-center gap-2.5", className)}
      aria-label={APP_NAME}
    >
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/[0.08]",
          iconSize,
        )}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" fill="url(#logo-gradient)" />
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="url(#logo-gradient)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="4" y1="4" x2="20" y2="20">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <span className={cn("font-medium tracking-tight text-white/90", textSize)}>
        {APP_NAME}
      </span>
    </div>
  );
}
