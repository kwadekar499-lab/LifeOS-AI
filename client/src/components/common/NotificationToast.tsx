import { useNotificationStore } from "@/stores/notificationStore";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationToast() {
  const { notifications, dismissNotification } = useNotificationStore();

  const icons = {
    success: <CheckCircle className="size-5 text-emerald-400" />,
    error: <AlertCircle className="size-5 text-rose-400" />,
    info: <Info className="size-5 text-sky-400" />,
    warning: <AlertTriangle className="size-5 text-amber-400" />,
  };

  const borders = {
    success: "border-emerald-500/20 bg-emerald-950/20",
    error: "border-rose-500/20 bg-rose-950/20",
    info: "border-sky-500/20 bg-sky-950/20",
    warning: "border-amber-500/20 bg-amber-950/20",
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3 w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md ${borders[notif.type] || "border-white/10 bg-[#0A0A0F]/80"}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[notif.type]}</div>
            <div className="flex-1 text-sm font-medium text-white/90 leading-tight">
              {notif.message}
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
