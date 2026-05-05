import { API_BASE_URL } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, GitBranch, Star, Shield, Search, Plus, Loader2, Pin, Globe, Lock, Cpu } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';

const RepoList = ({ onSelectRepo }: { onSelectRepo: (id: string) => void }) => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/repos`, { credentials: 'include' });
      if (res.ok) {
        setRepos(await res.json());
      }
    } catch (err: any) {
      console.error('Failed to fetch repos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* ── Editorial Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-4">
          <Badge variant="neutral" className="gap-2 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-black border-white/10 text-[var(--text-muted)] bg-transparent">
            <Globe size={12} /> External Repositories
          </Badge>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.9]">
            Source <span className="text-gradient-warm italic">Intelligence.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl font-light">
            We've indexed <span className="text-white font-medium">{repos.length} repositories</span> across your GitHub profile. Select a target for deep AI analysis.
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="glass" className="rounded-full px-6 text-[10px] tracking-widest uppercase font-bold border-white/5">
              Filters
           </Button>
           <Button variant="primary" className="rounded-full px-6 text-[10px] tracking-widest uppercase font-bold shadow-[0_0_20px_var(--accent-primary)]/20 shadow-none">
              <Plus size={14} className="mr-2" /> Connect
           </Button>
        </div>
      </motion.div>

      {/* ── Search Bar ── */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
        <Input
          className="pl-16 bg-[var(--surface-container)] border-white/5 h-16 rounded-3xl text-lg font-light placeholder:text-white/10"
          placeholder="Search your codebases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
             <div className="absolute inset-0 bg-[var(--accent-primary)]/20 blur-3xl rounded-full" />
             <Loader2 className="animate-spin text-[var(--accent-primary)] relative z-10" size={48} />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">Synchronizing Repositories</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-32 text-center rounded-[3rem] bg-[var(--surface-container)] border border-dashed border-white/5">
          <Github size={64} className="mx-auto text-white/5 mb-6" />
          <h3 className="text-2xl font-bold text-white">No matches found</h3>
          <p className="text-[var(--text-muted)] mt-2">Try a different search term or connect a new repository.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} onClick={() => onSelectRepo(repo.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Bento Repo Card ── */
const RepoCard = ({ repo, index, onClick }: any) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-[var(--surface-container)] border border-white/5 transition-all duration-500 hover:border-white/10 hover:bg-[#1a1a1a]"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(350px circle at ${x}px ${y}px, rgba(255,255,255,0.05), transparent 80%)`
          ),
        }}
      />

      <div className="p-8 h-full flex flex-col justify-between space-y-8">
        <div className="flex items-start justify-between relative z-10">
          <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-[var(--accent-primary)]/10 transition-colors">
            {repo.private ? <Lock size={22} className="text-white/40 group-hover:text-[var(--accent-primary)]" /> : <Globe size={22} className="text-white/40 group-hover:text-[var(--accent-primary)]" />}
          </div>
          {repo.securityEnabled && (
             <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#D4A647]">
                <Shield size={12} /> Secured
             </div>
          )}
        </div>

        <div className="relative z-10 space-y-2">
           <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-[var(--accent-warm)] transition-colors">{repo.name}</h3>
           <p className="text-sm text-[var(--text-muted)] line-clamp-2 font-light leading-relaxed">{repo.description || 'No description provided for this codebase.'}</p>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] relative z-10 pt-6 border-t border-white/5">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />{repo.language || 'Unknown'}</span>
          <span className="flex items-center gap-1.5"><Star size={12} fill="currentColor" className="text-yellow-500/20" />{repo.stars || 0}</span>
          <span className="flex items-center gap-1.5"><GitBranch size={12} />{repo.defaultBranch || 'main'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RepoList;
