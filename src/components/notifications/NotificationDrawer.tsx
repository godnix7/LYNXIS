import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Info, MailOpen } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../ui';

export const NotificationDrawer = () => {
  const { 
    notifications, 
    unreadCount, 
    isDrawerOpen, 
    setDrawerOpen, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/5 bg-[#050505]/95 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell size={24} className="text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[8px] font-bold text-white shadow-[0_0_10px_var(--danger)]">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Notifications</h2>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full p-2 text-[var(--text-muted)] transition-all hover:bg-white/5 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 border-b border-white/5 px-6 py-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-white transition-all"
                  >
                    <MailOpen size={14} />
                    Mark all read
                  </Button>
                </div>
              )}

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {notifications.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full flex-col items-center justify-center space-y-4 opacity-30"
                    >
                      <div className="rounded-full bg-white/5 p-6">
                        <Bell size={48} className="text-white" />
                      </div>
                      <p className="text-sm font-medium text-white">All caught up!</p>
                    </motion.div>
                  ) : (
                    notifications.map((notification) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                        onRead={() => markAsRead(notification.id)} 
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NotificationItem = ({ notification, onRead }: any) => {
  const icons: any = {
    info: <Info size={16} className="text-[var(--accent-primary)]" />,
    success: <CheckCircle2 size={16} className="text-[var(--success)]" />,
    warning: <AlertCircle size={16} className="text-[var(--warning)]" />,
    error: <AlertCircle size={16} className="text-[var(--danger)]" />,
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onRead}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
        notification.read 
          ? 'bg-white/[0.01] border-white/5 opacity-50' 
          : 'bg-white/[0.03] border-white/10 shadow-lg hover:border-[var(--accent-primary)]/30 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-start gap-4 p-4">
        <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-white/10`}>
          {icons[notification.type]}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold tracking-tight transition-colors ${notification.read ? 'text-[var(--text-muted)]' : 'text-white'}`}>
              {notification.title}
            </h4>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {formatTime(notification.createdAt)}
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
            {notification.description}
          </p>
        </div>
      </div>
      {!notification.read && (
        <div className="absolute left-0 top-0 h-full w-0.5 bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
      )}
    </motion.div>
  );
};


