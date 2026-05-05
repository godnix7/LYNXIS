import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Info, Plus, Save, Trash2, Rocket, RotateCcw } from 'lucide-react';
import { Card } from '../../components/ui';

interface FeatureFlag {
  id: string;
  name: string;
  isEnabled: boolean;
  rolloutPercentage: number;
}

const AdminFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = () => {
    setLoading(true);
    fetch('http://localhost:4003/api/admin/flags', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFlags(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleUpdateFlag = async (flag: FeatureFlag) => {
    setSavingId(flag.id);
    try {
      await fetch('http://localhost:4003/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flag),
        credentials: 'include'
      });
      // Update local state is enough, but refetch for total verification
      setSavingId(null);
    } catch (error) {
      setSavingId(null);
    }
  };

  const toggleFlag = (id: string) => {
    const updatedFlags = flags.map(f => {
      if (f.id === id) {
        const next = { ...f, isEnabled: !f.isEnabled };
        handleUpdateFlag(next);
        return next;
      }
      return f;
    });
    setFlags(updatedFlags);
  };

  const setPercentage = (id: string, value: number) => {
    const updatedFlags = flags.map(f => {
      if (f.id === id) {
        return { ...f, rolloutPercentage: value };
      }
      return f;
    });
    setFlags(updatedFlags);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <Shield size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Neural Circuitry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            Feature <span className="text-[var(--text-muted)]">Gating.</span>
          </h1>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-warm)] text-[var(--surface)] text-sm font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
          <Plus size={16} /> Deploy New Gate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-[var(--accent-warm)]/10 to-transparent border-[var(--accent-warm)]/20 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-4 text-[var(--accent-warm)]">
              <Info size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Global Control</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Authorized personnel can toggle system-wide infrastructure gates. Changes persist to the production neural engine in real-time.
            </p>
            <div className="flex items-center gap-4 py-3 border-y border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Active Gates</span>
                <span className="text-xl font-serif italic text-[var(--text-warm)]">{flags.filter(f => f.isEnabled).length}</span>
              </div>
              <div className="flex flex-col ml-12">
                <span className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Total Nodes</span>
                <span className="text-xl font-serif italic text-[var(--text-warm)]">{flags.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/[0.01] border-white/5 rounded-[2rem]">
             <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
               <Rocket size={12} className="text-emerald-400" /> Deployment Health
             </h4>
             <div className="h-24 w-full flex items-end gap-1 px-2">
                {Array(20).fill(0).map((_, i) => (
                  <div key={i} className="flex-1 bg-[var(--accent-warm)]/20 rounded-t-sm transition-all hover:bg-[var(--accent-warm)]/60" style={{ height: `${20 + Math.random() * 80}%` }} />
                ))}
             </div>
          </Card>
        </div>

        {/* Flags List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 animate-pulse bg-white/[0.01] border border-white/5 rounded-3xl" />
              ))
            ) : (
              flags.map((flag, i) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`p-6 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] transition-all duration-500 group ${flag.isEnabled ? 'ring-1 ring-[var(--accent-warm)]/10' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          flag.isEnabled ? 'bg-[var(--accent-warm)] text-[var(--surface)] shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'bg-white/5 text-[var(--text-muted)]'
                        }`}>
                          <Zap size={20} fill={flag.isEnabled ? 'currentColor' : 'none'} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[var(--text-warm)] mb-0.5">{flag.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${flag.isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                              {flag.isEnabled ? 'Operational' : 'Bypassed'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        {/* Rollout slider */}
                        <div className="flex flex-col items-center gap-1.5 px-4 min-w-[140px]">
                           <div className="flex justify-between w-full text-[9px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
                             <span>Rollout</span>
                             <span>{flag.rolloutPercentage}%</span>
                           </div>
                           <input 
                             type="range" 
                             min="0" max="100" 
                             value={flag.rolloutPercentage}
                             onChange={(e) => setPercentage(flag.id, parseInt(e.target.value))}
                             onMouseUp={() => handleUpdateFlag(flag)}
                             className="w-full accent-[var(--accent-warm)] h-1 bg-white/10 rounded-full cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                           />
                        </div>

                        {/* Toggle Button */}
                        <button 
                          onClick={() => toggleFlag(flag.id)}
                          className={`relative h-8 w-14 rounded-full transition-all duration-500 p-1 ${
                            flag.isEnabled ? 'bg-[var(--accent-warm)]' : 'bg-white/10'
                          }`}
                        >
                          <motion.div 
                            animate={{ x: flag.isEnabled ? 24 : 0 }}
                            className="h-6 w-6 rounded-full bg-white shadow-lg" 
                          />
                        </button>

                        <div className="flex items-center gap-2">
                          <button className="h-10 w-10 flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminFlags;
