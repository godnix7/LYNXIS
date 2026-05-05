import { API_BASE_URL } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, Shield, TrendingUp, Server, 
  Database, CheckCircle2, Cpu, Globe, Zap,
  Fingerprint, Layout, Hexagon
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';

const AdminOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/stats`, { credentials: 'include' });
        if (res.ok) setStats(await res.json());
      } catch (err) { console.error('Failed:', err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const kpis = [
    { label: 'Network Population', value: stats?.totalUsers || '0', icon: Users, color: 'var(--accent-primary)', sub: 'Verified Entities' },
    { label: 'Active Pulse', value: stats?.activeSessions || '0', icon: Activity, color: 'var(--success)', sub: 'Concurrent Nodes' },
    { label: 'Encryption Wall', value: stats?.securityScore || 'A+', icon: Shield, color: 'var(--accent-warm)', sub: 'Security Index' },
    { label: 'Neural Throughput', value: stats?.reviewsToday || '0', icon: TrendingUp, color: 'var(--accent-secondary)', sub: 'Analyses Today' },
  ];

  const services = [
    { name: 'API Gateway', status: 'Operational', load: '12ms' },
    { name: 'Ollama Intelligence', status: 'Operational', load: '850ms' },
    { name: 'PostgreSQL Core', status: 'Operational', load: '2ms' },
    { name: 'Redis Neural Cache', status: 'Operational', load: '1ms' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* ── Editorial Header ── */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-10"
      >
        <div className="space-y-6">
          <Badge variant="warm" className="gap-2 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] border-none w-fit">
            <Hexagon size={12} className="fill-[var(--accent-warm)]/20" /> Advanced Command
          </Badge>
          <h1 className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight leading-[0.85]">
            Root <span className="text-gradient-warm italic">Intelligence.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-light max-w-2xl leading-relaxed">
            Real-time infrastructure monitoring and global node population management. Peak system efficiency detected.
          </p>
        </div>
        <div className="flex gap-4">
           <Button variant="glass" className="h-16 px-10 rounded-full border-white/5 text-[10px] tracking-widest uppercase font-black">
              System Log
           </Button>
           <Button variant="primary" className="h-16 px-12 rounded-full text-[10px] tracking-widest uppercase font-black shadow-[0_0_40px_var(--accent-primary)]/20">
              Emergency Override
           </Button>
        </div>
      </motion.header>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {loading ? Array(4).fill(0).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-white/[0.01] border-white/5 rounded-[2rem]">
              <div className="h-full w-full" />
            </Card>
          )) : kpis.map((kpi, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-8 border-white/5 bg-[var(--surface-lowest)] hover:bg-[var(--surface-container)] transition-all duration-700 rounded-[2rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 text-white/[0.02] group-hover:text-white/[0.05] transition-colors pointer-events-none">
                   <Fingerprint size={100} />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="p-3 rounded-2xl bg-white/[0.03] w-fit" style={{ color: kpi.color }}>
                    <kpi.icon size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">{kpi.label}</p>
                    <p className="text-4xl font-black text-white mt-1 tracking-tight">{kpi.value}</p>
                    <p className="text-[10px] font-medium text-[var(--text-muted)] mt-2 opacity-60 italic">{kpi.sub}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Service Console */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 }}
        >
          <Card className="p-10 border-white/5 bg-[var(--surface-container)] rounded-[3rem] space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                  <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-400 border border-blue-500/10">
                     <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">System Core</h3>
                    <p className="text-sm text-[var(--text-muted)]">Real-time dependency verification</p>
                  </div>
               </div>
               <Badge variant="success" className="px-5 py-2 rounded-full font-black text-[10px] uppercase">Stable</Badge>
            </div>
            
            <div className="space-y-4">
              {services.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                  <div className="flex flex-col">
                    <span className="text-md font-bold text-white/90">{s.name}</span>
                    <span className="text-[10px] uppercase font-black text-white/20 tracking-widest mt-1">Latency: {s.load}</span>
                  </div>
                  <Badge variant="success" className="gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase"><CheckCircle2 size={12} />{s.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Global Infrastructure */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.6 }}
        >
          <Card className="p-10 border-white/5 bg-[var(--surface-container)] rounded-[3rem] space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
               <div className="p-4 rounded-3xl bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] border border-[var(--accent-warm)]/10">
                  <Globe size={24} />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white tracking-tight">Global Matrix</h3>
                 <p className="text-sm text-[var(--text-muted)]">Multi-region infrastructure health</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'CPU Cluster Load', value: '23.4%', icon: Activity },
                { label: 'Neural Memory', value: '1.2 / 4GB', icon: Database },
                { label: 'Storage Array', value: '18% Util', icon: Layout },
                { label: 'Uptime Matrix', value: '99.99%', icon: Zap },
              ].map((m, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                     <m.icon size={16} className="text-white/20" />
                     <span className="text-xs font-black text-white">{m.value}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
                <Button variant="glass" className="w-full h-16 rounded-full border-white/5 bg-white/[0.02] text-[10px] tracking-[0.3em] font-black uppercase hover:bg-white/[0.05]">
                   Launch Admin Console
                </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
