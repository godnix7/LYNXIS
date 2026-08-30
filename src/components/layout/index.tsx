import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LayoutDashboard, Database, GitPullRequest, Settings, CreditCard, LogOut, Shield } from 'lucide-react';
import { BackgroundMesh } from '../visual/BackgroundMesh';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { useAuth } from '../../context/AuthContext';
import NoiseOverlay from '../visual/NoiseOverlay';

export const Navbar = ({ onNavigate, activeTab }: { onNavigate: (tab: string) => void; activeTab: string }) => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[var(--surface-lowest)]/80 backdrop-blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent-warm)] to-[var(--accent-warm)]/60 group-hover:shadow-[0_0_20px_var(--accent-warm)] transition-all duration-500" />
            <span className="text-lg font-bold tracking-[0.1em] text-[var(--text-warm)] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>Aegis</span>
          </div>

          {/* Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink icon={<LayoutDashboard size={16} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavLink icon={<Database size={16} />} label="Repos" active={activeTab === 'repos'} onClick={() => onNavigate('repos')} />
            <NavLink icon={<GitPullRequest size={16} />} label="Reviews" active={activeTab === 'reviews'} onClick={() => onNavigate('reviews')} />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          <div className="relative h-full flex items-center">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all hover:bg-white/5 group"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/10" />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--text-warm)] leading-none mb-0.5">{displayName}</p>
                <p className="text-[9px] text-[var(--text-muted)] leading-none uppercase tracking-widest">Pro</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl z-50 p-2 overflow-hidden origin-top-right"
                    style={{ background: 'var(--surface-container)', border: '1px solid rgba(78, 70, 55, 0.15)' }}
                  >
                    <div className="px-3 py-2.5 mb-1">
                      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Account</p>
                      <p className="text-sm font-bold text-[var(--text-warm)] truncate mt-1">{user?.email}</p>
                    </div>
                    <div className="h-px bg-white/5 my-1" />
                    {(user?.roleAssignments?.some((ra: any) => ra.role === 'SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN')) && (
                      <button
                        onClick={() => { onNavigate('admin/overview'); setIsProfileOpen(false); }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--accent-warm)] hover:bg-white/5 transition-all group"
                      >
                        <Shield size={15} className="group-hover:animate-pulse" />Admin Console
                      </button>
                    )}
                    <button
                      onClick={() => { onNavigate('settings'); setIsProfileOpen(false); }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-warm)] hover:bg-white/5 transition-all group"
                    >
                      <Settings size={15} className="group-hover:text-[var(--accent-warm)] transition-colors" />Settings
                    </button>
                    <button
                      onClick={() => { onNavigate('billing'); setIsProfileOpen(false); }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-warm)] hover:bg-white/5 transition-all group"
                    >
                      <CreditCard size={15} className="group-hover:text-[var(--accent-warm)] transition-colors" />Billing
                    </button>
                    <div className="h-px bg-white/5 my-1" />
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={15} />Sign Out
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
    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      active
        ? 'text-[var(--accent-warm)] bg-[var(--accent-warm)]/5'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-warm)] hover:bg-white/3'
    }`}
  >
    {icon}
    {label}
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute bottom-0 left-3 right-3 h-px bg-[var(--accent-warm)]"
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    )}
  </button>
);

export const Shell = ({ children, onNavigate, activeTab }: { children: React.ReactNode; onNavigate: (tab: string) => void; activeTab: string }) => (
  <div className="relative min-h-screen bg-[var(--surface)] selection:bg-[var(--accent-primary)]/30 selection:text-white">
    <NoiseOverlay />
    <div className="mesh-glow" />
    <BackgroundMesh />
    <NotificationDrawer />
    <Navbar onNavigate={onNavigate} activeTab={activeTab} />
    <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  </div>
);

const NotificationBell = () => {
  const { unreadCount, setDrawerOpen } = useNotifications();
  return (
    <button
      onClick={() => setDrawerOpen(true)}
      className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-warm)] hover:bg-white/5 transition-all"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--accent-warm)] shadow-[0_0_8px_var(--accent-warm)]" />
      )}
    </button>
  );
};
