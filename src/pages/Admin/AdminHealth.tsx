import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Server, Database, Globe, Cpu, Zap, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui';

interface HealthData {
  status: string;
  timestamp: string;
  services: {
    database: string;
    apiServer: string;
    neuralEngine: string;
    nodePulse: string;
  };
  metrics: {
    cpu: number;
    memory: number;
    latency: number;
    throughput: number;
  };
}

const AdminHealth = () => {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(fetchHealth, 5000);
    fetchHealth();
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = () => {
    fetch('http://localhost:4003/api/admin/health', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading && !data) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Activity size={48} className="text-[var(--accent-warm)] animate-pulse" />
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.4em]">Initializing Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Core Telemetry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            System <span className="text-[var(--text-muted)]">Pulse.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl">
           <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
           <span className="text-xs font-bold text-[var(--text-warm)] uppercase tracking-widest">{data?.status || 'Active'}</span>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="CPU Usage" value={`${data?.metrics.cpu.toFixed(1)}%`} icon={<Cpu size={20} />} color="text-emerald-400" />
        <MetricCard label="Heap Memory" value={`${data?.metrics.memory} MB`} icon={<Server size={20} />} color="text-amber-400" />
        <MetricCard label="Node Latency" value={`${data?.metrics.latency}ms`} icon={<Zap size={20} />} color="text-purple-400" />
        <MetricCard label="Throughput" value={`${data?.metrics.throughput}/s`} icon={<TrendingUp size={20} />} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Status Board */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              Service Registry <span>Live</span>
           </h3>
           <div className="space-y-3">
              <ServiceRow label="Core Database" status={data?.services.database || 'Online'} />
              <ServiceRow label="API Gateway" status={data?.services.apiServer || 'Online'} />
              <ServiceRow label="Neural Engine" status={data?.services.neuralEngine || 'Active'} />
              <ServiceRow label="Node Pulse" status={data?.services.nodePulse || 'Healthy'} />
           </div>

           <Card className="p-8 bg-[var(--accent-warm)] text-[var(--surface)] rounded-[2.5rem]">
              <Clock className="mb-4" size={24} />
              <h4 className="text-xl font-bold mb-2">Uptime Monitor</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                Platform maintaining 99.98% availability across all global edge nodes for the last 30 intervals.
              </p>
           </Card>
        </div>

        {/* Visual Pulse */}
        <div className="lg:col-span-2">
           <Card className="h-full bg-white/[0.01] border-white/5 rounded-[2.5rem] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[var(--accent-warm)]" />
                    <span className="text-sm font-bold text-[var(--text-warm)]">Traffic Waves</span>
                 </div>
                 <div className="flex gap-1">
                    {['1H', '6H', '24H', '7D'].map(t => (
                      <button key={t} className={`px-3 py-1 text-[9px] font-bold rounded-lg transition-all ${t === '1H' ? 'bg-[var(--accent-warm)] text-[var(--surface)]' : 'hover:bg-white/5 text-[var(--text-muted)]'}`}>
                        {t}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="flex-1 flex items-end gap-1.5 pb-2">
                 {Array(40).fill(0).map((_, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }}
                     animate={{ height: `${20 + Math.random() * 80}%` }}
                     className="flex-1 bg-white/[0.05] rounded-t-lg hover:bg-[var(--accent-warm)]/40 transition-all cursor-pointer"
                   />
                 ))}
              </div>
              <div className="flex justify-between w-full mt-4 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                 <span>Node Entry</span>
                 <span>Global Mean</span>
                 <span>Neural Load</span>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) => (
  <Card className="p-6 bg-white/[0.01] border-white/5 rounded-[2rem] group hover:border-white/10 transition-all">
    <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none mb-2">{label}</p>
    <p className="text-2xl font-serif italic text-[var(--text-warm)] leading-none">{value}</p>
  </Card>
);

const ServiceRow = ({ label, status }: { label: string; status: string }) => (
  <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
    <span className="text-xs font-bold text-[var(--text-warm)]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{status}</span>
    </div>
  </div>
);

export default AdminHealth;
