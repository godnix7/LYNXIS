import { API_BASE_URL } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, AlertCircle, MessageSquare, Shield, 
  Zap, ChevronRight, Maximize2, Github, Layout,
  Terminal, Code2, Sparkles, Fingerprint, Layers
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useAI, AIModel } from '../../context/AIContext';

const PRReviewViewer = ({ repoId }: { repoId?: string }) => {
  const [prData, setPrData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { selectedModel, setSelectedModel } = useAI();

  const fetchPRData = async () => {
    try {
      setLoading(true);
      const url = repoId
        ? `${API_BASE_URL}/api/reviews/latest?repoId=${repoId}`
        : '${API_BASE_URL}/api/reviews/latest';
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) setPrData(await res.json());
    } catch (err: any) {
      console.error('Failed to fetch PR data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPRData(); }, [repoId]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-3xl border-4 border-[var(--accent-primary)]/20 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <Zap className="text-[var(--accent-primary)] animate-pulse" size={32} />
          </div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent-primary)]">Syncing Intelligence...</p>
    </div>
  );

  if (!prData) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
       <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white/20 mb-4">
          <Layers size={48} />
       </div>
       <h2 className="text-3xl font-bold text-white tracking-tight">No Intelligence Found.</h2>
       <p className="text-[var(--text-secondary)] font-light max-w-sm">
          Connect a repository and trigger your first neural scan to begin generating review intelligence.
       </p>
       <Button variant="primary" className="h-12 px-8 rounded-full text-[10px] tracking-widest font-black uppercase mt-4">
          Trigger Neural Scan
       </Button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-32"
    >
      {/* ── Editorial Header ── */}
      <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="primary" className="gap-2 px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-none">
              <Github size={12} /> PR #{prData.number}
            </Badge>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 group hover:border-[var(--accent-warm)]/30 transition-all">
              <Sparkles size={12} className="text-[var(--accent-warm)]" />
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                className="bg-transparent text-[10px] font-black tracking-widest uppercase text-white/60 group-hover:text-white outline-none cursor-pointer appearance-none"
              >
                <option value="anthropic">Anthropic Claude</option>
                <option value="openai">OpenAI GPT-4</option>
                <option value="gemini">Google Gemini</option>
              </select>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
          <h1 className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight leading-[0.85]">
            Review <span className="text-gradient-warm italic">Intelligence.</span>
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-[var(--text-secondary)] font-light text-lg">
            <span className="flex items-center gap-2 text-white/60 font-medium bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <Code2 size={18} className="text-[var(--accent-primary)]" />
              {prData.owner}/{prData.repo}
            </span>
            <span className="text-white/20">/</span>
            <span className="font-mono text-sm bg-white/3 px-3 py-1.5 rounded-xl border border-white/5">{prData.branch}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="glass" className="h-16 px-8 rounded-full border-white/5 text-[11px] tracking-widest uppercase font-black hover:bg-white/5">
             Full Diff Report
          </Button>
          <Button variant="primary" className="h-16 px-10 rounded-full text-[11px] tracking-widest uppercase font-black shadow-[0_0_40px_var(--accent-primary)]/20">
             Approve Merge
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Findings Panel */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <Shield size={24} />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Vulnerability Report</h3>
                  <p className="text-sm text-[var(--text-muted)]">Automated scan detected {prData.findings?.length || 0} security vectors.</p>
               </div>
            </div>
            <p className="text-4xl font-black text-white/5">{prData.findings?.length || 0}</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {(prData.findings || []).map((f: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-8 border-white/5 bg-[var(--surface-lowest)] hover:bg-[var(--surface-container)] transition-all duration-500 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-red-500/10 transition-colors pointer-events-none">
                       <Fingerprint size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                       <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                             <Badge variant="danger" className="rounded-full px-3 py-1 font-black">High Risk</Badge>
                             <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Ref: SEC-{100+i}</span>
                          </div>
                          <h4 className="text-2xl font-bold text-white tracking-tight">{f.type}</h4>
                          <p className="text-md text-[var(--text-secondary)] leading-relaxed max-w-2xl">{f.message}</p>
                          <div className="flex items-center gap-3 text-sm font-mono text-cyan-400 bg-cyan-950/20 w-fit px-4 py-2 rounded-xl border border-cyan-500/20">
                             <Terminal size={14} /> {f.file}:{f.line}
                          </div>
                       </div>
                       <Button variant="glass" className="rounded-full bg-white/5 border-white/5 text-[10px] tracking-widest font-black uppercase">
                          Fix Intelligence
                       </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-10 border-white/5 bg-[var(--surface-container)] rounded-[3rem] space-y-10 sticky top-32">
             <div className="space-y-6">
                <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Neural Summary</h3>
                <div className="space-y-8">
                   <SummaryScore label="Security Integrity" value="65/100" color="var(--danger)" />
                   <SummaryScore label="Code Efficiency" value="92/100" color="var(--success)" />
                   <SummaryScore label="Compliance" value="Passed" color="var(--accent-warm)" />
                 </div>
             </div>

             <div className="pt-10 border-t border-white/5 space-y-6">
                <div className="p-4 rounded-3xl bg-green-500/5 border border-green-500/10 flex items-center gap-4">
                   <CheckCircle2 size={24} className="text-green-400" />
                   <div>
                      <p className="text-sm font-bold text-white">Green Light</p>
                      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Logic verified</p>
                   </div>
                </div>
                <div className="p-6 rounded-3xl bg-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/10">
                   <div className="flex items-center gap-3 mb-4">
                      <Layers size={18} className="text-[var(--accent-primary)]" />
                      <p className="text-sm font-bold text-white">Engine V3.2</p>
                   </div>
                   <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic font-light">
                      "Analysis indicates potential SQL injection in the ORM layer. Recommend parameterization for the `search` function."
                   </p>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

const SummaryScore = ({ label, value, color }: any) => (
   <div className="space-y-2">
      <div className="flex justify-between items-end">
         <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
         <p className="text-sm font-bold text-white">{value}</p>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: value.includes('/') ? `${parseInt(value)}%` : '100%' }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full rounded-full shadow-[0_0_10px]"
            style={{ backgroundColor: color, shadowColor: color }}
         />
      </div>
   </div>
);

export default PRReviewViewer;
