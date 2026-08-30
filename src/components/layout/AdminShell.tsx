import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Shield, Database, 
  Terminal, Bell, GitPullRequest, LogOut,
  Activity, Flag, Search
} from 'lucide-react';
import { Button, Badge, Input } from '../ui';

interface AdminShellProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children, activeTab, onNavigate }) => {

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'repos', label: 'Repositories', icon: Database },
    { id: 'reviews', label: 'Review Monitor', icon: GitPullRequest },
    { id: 'flags', label: 'Feature Flags', icon: Flag },
    { id: 'audit', label: 'Audit Logs', icon: Terminal },
    { id: 'security', label: 'Security Panel', icon: Shield },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl z-30">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tighter text-white">AEGIS</span>
              <span className="text-[10px] font-bold block leading-none text-[var(--accent-primary)] uppercase tracking-widest mt-0.5">Admin v2</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-8">
            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Users size={20} className="text-white/40" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Administrator</p>
              <p className="text-xs text-[var(--text-muted)] truncate">System Access</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20' 
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-[var(--accent-primary)]' : 'text-white/30 group-hover:text-white/60'} />
              <span className="font-semibold text-sm">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeInd" className="ml-auto w-1 h-4 bg-[var(--accent-primary)] rounded-full shadow-[0_0_8px_var(--accent-primary)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button 
            onClick={() => window.location.href = '/'}
            variant="glass" 
            className="w-full justify-start gap-3 border-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span className="font-bold uppercase tracking-wider text-[10px]">Exit Admin Mode</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-white capitalize">{activeTab}</h2>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <Badge variant="secondary" className="hidden md:flex bg-green-500/10 text-green-400 border-green-500/20 gap-1.5 p-1 px-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Operational
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={16} />
              <Input className="pl-10 h-10 w-64 bg-white/5 border-white/5 focus:bg-white/10" placeholder="Global Admin Search..." />
            </div>
            <Button variant="glass" className="h-10 w-10 p-0 rounded-xl relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
