import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, Filter, ExternalLink, Activity, Users, GitPullRequest, Shield } from 'lucide-react';
import { Card } from '../../components/ui';

interface AdminRepo {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  status: string;
  health: string;
  user: {
    username: string;
    email: string;
  };
  _count: {
    pullRequests: number;
  };
  updatedAt: string;
}

const AdminRepos = () => {
  const [repos, setRepos] = useState<AdminRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:4003/api/admin/repos', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRepos = repos.filter(repo => 
    repo.fullName.toLowerCase().includes(search.toLowerCase()) ||
    repo.user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <Database size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Node Registry</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            Repository <span className="text-[var(--text-muted)]">Matrix.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-warm)] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search registry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-[var(--text-warm)] focus:outline-none focus:border-[var(--accent-warm)]/50 focus:ring-1 focus:ring-[var(--accent-warm)]/20 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<Database size={18} />} label="Total Nodes" value={repos.length} />
        <StatCard icon={<Activity size={18} />} label="Active Sync" value={repos.filter(r => r.status === 'connected').length} />
        <StatCard icon={<Users size={18} />} label="Verified Owners" value={new Set(repos.map(r => r.user.email)).size} />
      </div>

      {/* Repos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="h-48 animate-pulse bg-white/[0.01] border-white/5 rounded-[2rem]">
                <div className="h-full w-full" />
              </Card>
            ))
          ) : (
            filteredRepos.map((repo, i) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 h-full group hover:border-[var(--accent-warm)]/30 transition-all duration-500 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[var(--accent-warm)]/10 flex items-center justify-center text-[var(--accent-warm)] group-hover:scale-110 transition-transform duration-500">
                        <Database size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-warm)] mb-1">{repo.name}</h3>
                        <p className="text-xs text-[var(--text-muted)] tracking-wide">{repo.fullName}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                      repo.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-[var(--text-muted)]'
                    }`}>
                      {repo.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Intelligence</p>
                      <div className="flex items-center gap-2">
                        <GitPullRequest size={12} className="text-[var(--accent-warm)]" />
                        <span className="text-sm font-bold text-[var(--text-warm)]">{repo._count.pullRequests} PRs</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Health index</p>
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-emerald-400" />
                        <span className="text-sm font-bold text-[var(--text-warm)]">{repo.health || 'Stable'}</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase mb-1">Guardian</p>
                      <span className="text-sm font-bold text-[var(--text-warm)] truncate block">{repo.user.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-[10px] text-[var(--text-muted)] italic">
                      Last pulse: {new Date(repo.updatedAt).toLocaleDateString()}
                    </p>
                    <button className="text-[var(--accent-warm)] hover:text-[var(--accent-warm)]/80 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) => (
  <Card className="p-6 bg-white/[0.02] border-white/5 rounded-3xl flex items-center gap-4">
    <div className="h-10 w-10 rounded-xl bg-[var(--accent-warm)]/10 flex items-center justify-center text-[var(--accent-warm)]">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <p className="text-2xl font-serif italic text-[var(--text-warm)] leading-none">{value}</p>
    </div>
  </Card>
);

export default AdminRepos;
