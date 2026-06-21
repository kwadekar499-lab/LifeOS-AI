import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { APP_NAME, APP_TAGLINE, CTA_LABEL } from "@/constants/app";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export const HeroSection = memo(function HeroSection() {
  return (
    <section
      className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      aria-labelledby="hero-heading"
    >
      <motion.p
        className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-white/40"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Coming soon
      </motion.p>

      <motion.h1
        id="hero-heading"
        className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        {APP_NAME}
      </motion.h1>

      <motion.p
        className="mt-6 max-w-lg text-base leading-relaxed text-white/45 sm:text-lg"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        {APP_TAGLINE}
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.35}
      >
        <motion.button
          type="button"
          className="focus-ring group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-[#0A0A0F] transition-shadow hover:shadow-[0_0_40px_rgba(255,255,255,0.12)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          aria-label={`${CTA_LABEL} with ${APP_NAME}`}
        >
          {CTA_LABEL}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </motion.button>
      </motion.div>
    </section>
  );
});
