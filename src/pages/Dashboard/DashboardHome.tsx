import { API_BASE_URL } from '../../config/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  GitPullRequest, Shield, Zap, Activity, CheckCircle2, AlertCircle, Info,
  ArrowUpRight, Sparkles, Clock, ChevronRight, BarChart3, Eye, TrendingUp,
  Fingerprint, Cpu, Globe
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useAI } from '../../context/AIContext';

interface Stats {
  openPrs: number;
  securityRisks: number;
  reviewTime: string;
  healthScore: string;
  activeAlerts: number;
}

const DashboardHome = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const { user } = useAuth();
  const { selectedModel } = useAI();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, markAsRead } = useNotifications();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`, { credentials: 'include' });
      if (res.ok) setStats(await res.json());
    } catch (error) {
       console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const recentActivity = notifications.slice(0, 5);
  const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const displayName = user?.firstName || user?.username || 'Guest Engineer';

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-2">
      {/* ── Editorial Header ── */}
      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="warm" className="gap-2 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-black bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] border-none">
              <Fingerprint size={12} />
              System Operational
            </Badge>
            <Badge variant="primary" className="gap-2 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-black bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-none">
              <Cpu size={12} />
              Agent: {selectedModel}
            </Badge>
          </div>
          <h1 className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight leading-[0.85]">
            {greeting},<br />
            <span className="text-gradient-warm italic">{displayName}.</span>
          </h1>
        </div>
        <div className="flex flex-col gap-4 text-left md:text-right">
           <p className="text-[var(--text-secondary)] text-lg max-w-xs leading-relaxed font-light">
            AI processing is at peak efficiency. <span className="text-white font-medium">12 active modules</span> monitoring your stack.
          </p>
          <div className="flex gap-3 justify-start md:justify-end">
             <Button variant="glass" size="sm" className="rounded-full border-white/5 bg-white/[0.02] text-[10px] tracking-widest uppercase font-bold" onClick={() => onNavigate('settings')}>
                System Config
             </Button>
             <Button variant="primary" size="sm" className="rounded-full px-6 text-[10px] tracking-widest uppercase font-bold shadow-[0_0_20px_var(--accent-primary)]/20" onClick={() => onNavigate('repos')}>
                Deploy Node
             </Button>
          </div>
        </div>
      </motion.header>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-5 h-full md:h-[900px]">
        
        {/* Card 1: System Pulse (2x2) */}
        <BentoCard className="md:col-span-2 md:row-span-2 group" delay={0.1}>
          <div className="h-full flex flex-col justify-between p-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-blue-500/10"><BarChart3 size={20} className="text-blue-400" /></div>
                 <h3 className="text-xl font-bold text-white tracking-tight">System Pulse</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Real-time throughput analysis</p>
            </div>
            
            <div className="flex-1 flex items-end justify-center py-10 relative overflow-hidden">
                <PulseChart color="var(--accent-primary)" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-lowest)] to-transparent h-1/2 mt-auto" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Memory</p>
                   <p className="text-xl font-bold text-white mt-1">4.2GB</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Latent</p>
                   <p className="text-xl font-bold text-white mt-1">12ms</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Active</p>
                   <p className="text-xl font-bold text-blue-400 mt-1">99.8%</p>
                </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Security Insights (2x1) */}
        <BentoCard className="md:col-span-2 md:row-span-1 border-red-500/10 bg-red-500/[0.01]" delay={0.2}>
           <div className="p-8 flex items-center justify-between h-full">
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-red-500/10"><Shield size={20} className="text-red-400" /></div>
                   <h3 className="text-xl font-bold text-white tracking-tight">Security Wall</h3>
                 </div>
                 <p className="text-sm text-[var(--text-secondary)] max-w-[200px]">3 unresolved vulnerabilities detected in `core-api`</p>
                 <Button variant="ghost" size="sm" className="p-0 text-red-400 font-bold tracking-widest uppercase text-[10px] gap-2 hover:bg-transparent">
                   Run Deep Scan <ChevronRight size={12} />
                 </Button>
              </div>
              <div className="relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                 <p className="text-7xl font-black text-white relative z-10 tracking-tighter">03</p>
              </div>
           </div>
        </BentoCard>

        {/* Card 3: Global Health (1x1) */}
        <BentoCard className="md:col-span-1 md:row-span-1" delay={0.3}>
           <div className="p-6 h-full flex flex-col justify-between">
              <div className="p-2.5 rounded-xl bg-gold-500/10 w-fit"><Globe size={20} className="text-[var(--accent-warm)]" /></div>
              <div>
                 <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Infrastructure</p>
                 <p className="text-3xl font-bold text-white mt-1">Global</p>
              </div>
              <Badge variant="warm" className="w-fit text-[9px]">9 Region High</Badge>
           </div>
        </BentoCard>

        {/* Card 4: AI Logic (1x1) */}
        <BentoCard className="md:col-span-1 md:row-span-1" delay={0.4}>
           <div className="p-6 h-full flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-primary)]/10 blur-3xl rounded-full" />
              <div className="p-2.5 rounded-xl bg-purple-500/10 w-fit"><Cpu size={20} className="text-purple-400" /></div>
              <div>
                 <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">AI Co-Pilot</p>
                 <p className="text-3xl font-bold text-white mt-1">Active</p>
              </div>
              <div className="flex gap-1">
                 {[1,2,3,4].map(i => <div key={i} className="h-1 w-4 rounded-full bg-purple-500/20" />)}
              </div>
           </div>
        </BentoCard>

        {/* Card 5: PR Velocity (2x1) */}
        <BentoCard className="md:col-span-2 md:row-span-1" delay={0.5}>
           <div className="p-8 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-green-500/10"><TrendingUp size={20} className="text-green-400" /></div>
                   <h3 className="text-xl font-bold text-white tracking-tight">PR Velocity</h3>
                 </div>
                 <Badge variant="success">+12.4%</Badge>
              </div>
              <div className="flex gap-2 items-end h-20 pt-4">
                 {[40, 70, 45, 90, 65, 80, 55, 95, 100, 85].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + (i * 0.05), duration: 0.8 }}
                      className="flex-1 bg-gradient-to-t from-green-500/10 to-green-500/40 rounded-t-sm" 
                    />
                 ))}
              </div>
           </div>
        </BentoCard>

      </div>
    </div>
  );
};

/* ── Bento Card Wrapper with Mouse Glow ── */
const BentoCard = ({ children, className, delay }: { children: React.ReactNode, className?: string, delay: number }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-[2.5rem] bg-[var(--surface-container)] border border-white/5 transition-all duration-700 hover:border-white/10 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

// Helper for motion value template string
function useTemplate(strings: TemplateStringsArray, ...values: any[]) {
  return useTransform(values, (v) => {
    return strings.reduce((acc, str, i) => acc + str + (v[i] ?? ''), '');
  });
}

/* ── Pulse Chart (SVG Art) ── */
const PulseChart = ({ color }: { color: string }) => {
  return (
     <svg width="400" height="150" viewBox="0 0 400 150" className="opacity-40">
        <motion.path
          d="M0 75 Q 50 20, 100 75 T 200 75 T 300 75 T 400 75"
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, x: [0, -100, 0] }}
          transition={{ pathLength: { duration: 2 }, x: { repeat: Infinity, duration: 10, ease: "linear" } }}
        />
        <motion.path
          d="M0 75 Q 50 130, 100 75 T 200 75 T 300 75 T 400 75"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ x: [0, -100, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
     </svg>
  );
};

export default DashboardHome;
