import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: ToastNotification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, type = "info", duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newNotification: ToastNotification = { id, type, message, duration };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));
