import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChat from '../components/AIChat';
import SearchModal from '../components/SearchModal';
import NotificationStack from '../components/NotificationStack';
import { useAppStore } from '../store/useAppStore';
import { MessageCircle } from 'lucide-react';

export default function MainLayout() {
  const { setAiChatOpen, aiChatOpen } = useAppStore();

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />

      {/* Page Content */}
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* AI Chat */}
      <AIChat />

      {/* Search */}
      <SearchModal />

      {/* Notifications */}
      <NotificationStack />

      {/* Floating AI Button */}
      {!aiChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
          }}
          title="Ask Artha AI"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <MessageCircle size={22} />
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}
