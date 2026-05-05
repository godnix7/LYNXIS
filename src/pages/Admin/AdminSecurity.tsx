import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Lock, UserCheck, Globe, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui';

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: {
    username: string;
    avatarUrl: string | null;
  };
}

const AdminSecurity = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4003/api/admin/audit-logs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <Lock size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Guardian Protocol</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            Security <span className="text-[var(--text-muted)]">Audit.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <span className="text-xs font-bold text-[var(--text-warm)]">IPS Operational</span>
           </div>
        </div>
      </div>

      {/* Security KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecurityStat icon={<Eye className="text-emerald-400" />} label="Active Sessions" value={logs.length > 0 ? "12" : "0"} />
        <SecurityStat icon={<Shield className="text-[var(--accent-warm)]" />} label="Privacy Score" value="A+" />
        <SecurityStat icon={<AlertCircle className="text-red-400" />} label="Access Denied" value="0" />
      </div>

      {/* Audit Feed */}
      <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--text-warm)]">
               <Globe size={18} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-[var(--text-warm)]">Event Log</h3>
               <p className="text-xs text-[var(--text-muted)] tracking-widest uppercase">Global access telemetry</p>
             </div>
           </div>
           <button className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--accent-warm)] uppercase tracking-widest">Download full audit</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Entity</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Protocol</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Identification</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-4 h-16 bg-white/[0.01] border-b border-white/5" />
                    </tr>
                  ))
                ) : (
                  logs.map((log, i) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="h-8 w-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                              {log.actor.avatarUrl ? (
                                <img src={log.actor.avatarUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-white/5 flex items-center justify-center text-[10px]">{log.actor.username[0]}</div>
                              )}
                           </div>
                           <span className="text-sm font-bold text-[var(--text-warm)]">{log.actor.username}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
                             log.action.includes('LOGIN') ? 'bg-emerald-500/10 text-emerald-400' :
                             log.action.includes('DELETE') ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-[var(--text-muted)]'
                           }`}>
                             {log.action.replace('_', ' ')}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-xs font-mono text-[var(--text-muted)]">{log.ip || '0.0.0.0'}</span>
                            <span className="text-[10px] text-[var(--text-muted)]/50 truncate max-w-[200px]">{log.userAgent || 'Unknown Agent'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex flex-col items-end">
                            <span className="text-xs text-[var(--text-warm)] font-bold">{new Date(log.createdAt).toLocaleDateString()}</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</span>
                         </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const SecurityStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Card className="p-6 bg-white/[0.01] border-white/5 rounded-[2rem] flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
         <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1">{label}</p>
         <p className="text-3xl font-serif italic text-[var(--text-warm)]">{value}</p>
      </div>
    </div>
    <div className="text-emerald-500">
      <UserCheck size={20} />
    </div>
  </Card>
);

export default AdminSecurity;
