import { memo } from "react";
import { motion } from "framer-motion";
import type { WithChildren } from "@/types";

export const PageTransition = memo(function PageTransition({
  children,
}: WithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
});
