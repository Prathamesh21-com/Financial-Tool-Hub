import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  info: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
};

export default function NotificationStack() {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed bottom-24 left-4 z-[90] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map(notif => {
          const Icon = icons[notif.type];
          const c = colors[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ background: c.bg, border: `1px solid ${c.border}`, backdropFilter: 'blur(20px)' }}
            >
              <Icon size={16} style={{ color: c.text, flexShrink: 0, marginTop: 2 }} />
              <p className="text-sm text-white flex-1">{notif.message}</p>
              <button onClick={() => removeNotification(notif.id)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
