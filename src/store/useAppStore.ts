import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification } from '../types';

interface AppStore {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Namaste intro
  showNamaste: boolean;
  setShowNamaste: (val: boolean) => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;

  // Auth
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  adminPassword: string;

  // UI
  aiChatOpen: boolean;
  setAiChatOpen: (val: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (val: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;

  // XP & Streaks
  addXP: (amount: number) => void;
  incrementStreak: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // Namaste
      showNamaste: true,
      setShowNamaste: (val) => set({ showNamaste: val }),

      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...updates } });
      },

      // Admin
      isAdmin: false,
      setIsAdmin: (val) => set({ isAdmin: val }),
      adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || 'admin@FTH2024',

      // UI
      aiChatOpen: false,
      setAiChatOpen: (val) => set({ aiChatOpen: val }),
      searchOpen: false,
      setSearchOpen: (val) => set({ searchOpen: val }),
      sidebarOpen: false,
      setSidebarOpen: (val) => set({ sidebarOpen: val }),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString();
        set(s => ({
          notifications: [
            ...s.notifications,
            { ...notification, id, timestamp: new Date() }
          ]
        }));
        // Auto-remove after 5s
        setTimeout(() => {
          set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
        }, 5000);
      },
      removeNotification: (id) => set(s => ({
        notifications: s.notifications.filter(n => n.id !== id)
      })),

      // XP
      addXP: (amount) => {
        const user = get().user;
        if (user) {
          const newXP = user.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          set({ user: { ...user, xp: newXP, level: newLevel } });
        }
      },
      incrementStreak: () => {
        const user = get().user;
        if (user) set({ user: { ...user, streak: user.streak + 1 } });
      },
    }),
    {
      name: 'fth-app-store',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        showNamaste: state.showNamaste,
      }),
    }
  )
);
