import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, Search, ExternalLink, Activity, Clock, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui';

interface AdminReview {
  id: string;
  title: string;
  number: number;
  state: string;
  author: string;
  authorAvatar: string | null;
  healthScore: number | null;
  lastScannedAt: string;
  repository: {
    name: string;
    fullName: string;
  };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:4003/api/admin/reviews', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(search.toLowerCase()) ||
    review.repository.name.toLowerCase().includes(search.toLowerCase()) ||
    review.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <GitPullRequest size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Intelligence Feed</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            Review <span className="text-[var(--text-muted)]">Intelligence.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-warm)] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search intelligence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-[var(--text-warm)] focus:outline-none focus:border-[var(--accent-warm)]/50 focus:ring-1 focus:ring-[var(--accent-warm)]/20 transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MiniStat label="Global Scans" value={reviews.length} icon={<Activity size={12} />} />
        <MiniStat label="Avg Health" value={`${Math.round(reviews.reduce((acc, r) => acc + (r.healthScore || 0), 0) / (reviews.length || 1))}%`} icon={<Shield size={12} />} />
        <MiniStat label="Open nodes" value={reviews.filter(r => r.state === 'open').length} icon={<GitPullRequest size={12} />} />
        <MiniStat label="Secure" value={reviews.filter(r => (r.healthScore || 0) > 80).length} icon={<CheckCircle2 size={12} />} />
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-white/[0.01] border border-white/5 rounded-2xl" />
            ))
          ) : (
            filteredReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="group relative p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-[var(--accent-warm)]/20 rounded-2xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Health Indicator Left */}
                    <div className={`hidden md:flex h-12 w-1 items-center rounded-full ${
                      (review.healthScore || 0) > 80 ? 'bg-emerald-500/40' : 
                      (review.healthScore || 0) > 50 ? 'bg-amber-500/40' : 'bg-red-500/40'
                    }`} />

                    {/* Author Avatar */}
                    <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10">
                      {review.authorAvatar ? (
                        <img src={review.authorAvatar} alt={review.author} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[var(--accent-warm)]/10 flex items-center justify-center text-[var(--accent-warm)] text-xs font-bold">
                          {review.author[0]}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-[var(--accent-warm)] uppercase tracking-widest">{review.repository.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">#{review.number}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-warm)] truncate pr-4 group-hover:text-[var(--accent-warm)] transition-colors">
                        {review.title}
                      </h3>
                    </div>

                    {/* Telemetry Right */}
                    <div className="flex items-center gap-8 text-[var(--text-muted)] border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-widest mb-1.5 font-bold">Health</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            (review.healthScore || 0) > 80 ? 'text-emerald-400' : 
                            (review.healthScore || 0) > 50 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {review.healthScore || '??'}%
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end min-w-[100px]">
                        <span className="text-[9px] uppercase tracking-widest mb-1.5 font-bold">Last pulse</span>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-[var(--text-muted)]" />
                          <span>{new Date(review.lastScannedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/10 transition-all">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) => (
  <div className="px-4 py-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between group hover:border-[var(--accent-warm)]/30 transition-all">
    <div>
      <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[var(--text-warm)]">{value}</p>
    </div>
    <div className="text-[var(--text-muted)] group-hover:text-[var(--accent-warm)] transition-colors">
      {icon}
    </div>
  </div>
);

export default AdminReviews;
