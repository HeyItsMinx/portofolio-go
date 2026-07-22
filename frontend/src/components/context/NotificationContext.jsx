import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { registerNotifier } from '@/lib/notifier';

const NotificationContext = createContext(null);
let idCounter = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const remove = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((message, { type = 'success', duration = 4000 } = {}) => {
    const id = ++idCounter;
    setNotifications(prev => [...prev, { id, message, type }]);
    if (duration) setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  useEffect(() => {
    registerNotifier(notify);
  }, [notify]);

  return (
    <NotificationContext.Provider value={{ notify, remove }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 w-80 max-w-[calc(100vw-3rem)]">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className={`relative flex items-start gap-3 bg-neutral-950 border-2 p-4 pr-8 font-mono ${
                n.type === 'error' ? 'border-red-600'
                  : n.type === 'delete' ? 'border-neutral-700'
                  : n.type === 'warning' ? 'border-yellow-500'
                  : 'border-[var(--blood)]'
              }`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 92% 100%, 0 100%)' }}
            >
              <span className="shrink-0 mt-0.5">
                {n.type === 'error' ? <XCircle size={18} className="text-red-500" />
                  : n.type === 'delete' ? <Trash2 size={18} className="text-neutral-400" />
                  : <CheckCircle2 size={18} className="text-[var(--blood)]" />}
              </span>
              <p className="text-white text-sm leading-snug">{n.message}</p>
              <button onClick={() => remove(n.id)} className="absolute top-2 right-2 text-neutral-600 hover:text-white text-xs">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}