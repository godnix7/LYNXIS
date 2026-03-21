import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LayoutDashboard, Database, GitPullRequest, Settings, CreditCard } from 'lucide-react';
import { BackgroundMesh } from '../visual/BackgroundMesh';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onNavigate, activeTab }: { onNavigate: (tab: string) => void; activeTab: string }) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || 'User';

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-6">
      <div className="flex items-stretch justify-between glass px-6 h-16 rounded-2xl border-white/10 shadow-2xl relative">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="h-8 w-8 rounded-lg bg-[var(--grad-primary)]" />
            <span className="text-xl font-bold tracking-tight text-white">LYNXIS</span>
          </div>
          
          <div className="hidden items-center gap-6 md:flex">
            <NavLink 
                icon={<LayoutDashboard size={18} />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => onNavigate('dashboard')}
            />
            <NavLink 
                icon={<Database size={18} />} 
                label="Repositories" 
                active={activeTab === 'repos'}
                onClick={() => onNavigate('repos')}
            />
            <NavLink 
                icon={<GitPullRequest size={18} />} 
                label="Pull Requests" 
                active={activeTab === 'reviews'}
                onClick={() => onNavigate('reviews')}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />
          <div className="h-8 w-px bg-white/10 mr-2" />
          
          <div className="relative h-full flex items-center">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10 group"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="h-8 w-8 rounded-lg object-cover border border-white/20" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-[var(--grad-primary)] flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-none mb-0.5">{displayName}</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-none uppercase tracking-tighter">Pro Account</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-[calc(100%+12px)] w-56 glass rounded-2xl border-white/10 shadow-2xl z-50 p-2 py-3 overflow-hidden origin-top-right"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Account</p>
                        <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>

                    <button 
                      onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <Settings size={16} className="group-hover:text-[var(--accent-primary)] transition-colors" />
                      Settings
                    </button>
                    <button 
                      onClick={() => { onNavigate('billing'); setIsProfileOpen(false); }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <CreditCard size={16} className="group-hover:text-[var(--accent-primary)] transition-colors" />
                      Billing
                    </button>
                    
                    <div className="h-px bg-white/5 my-2" />
                    
                    <button 
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--danger)]/80 hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all"
                    >
                      <User size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ icon, label, onClick, active = false }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
      active ? 'text-white bg-white/5 shadow-inner' : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/2'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const Shell = ({ children, onNavigate, activeTab }: { children: React.ReactNode; onNavigate: (tab: string) => void; activeTab: string }) => {
  return (
    <div className="relative min-h-screen selection:bg-[var(--accent-primary)] selection:text-white">
      <div className="mesh-glow" />
      <BackgroundMesh />
      <NotificationDrawer />
      <Navbar onNavigate={onNavigate} activeTab={activeTab} />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NotificationBell = () => {
  const { unreadCount, setDrawerOpen } = useNotifications();
  return (
    <button 
        onClick={() => setDrawerOpen(true)}
        className="relative rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-white"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] shadow-[0_0_8px_var(--danger)]" />
      )}
    </button>
  );
};
