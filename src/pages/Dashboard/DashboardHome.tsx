import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, Shield, Zap, Activity, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { useNotifications } from '../../context/NotificationContext';

interface Stats {
  openPrs: number;
  securityRisks: number;
  reviewTime: string;
  healthScore: string;
  activeAlerts: number;
}

const DashboardHome = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, markAsRead } = useNotifications();

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4003/api/stats', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const recentActivity = notifications.slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="space-y-6 animate-reveal">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white md:text-7xl">
            PR Intelligence for <br />
            <span className="text-gradient">Modern Teams.</span>
          </h1>
          <p className="max-w-2xl text-xl text-[var(--text-secondary)] leading-relaxed">
            Automate code reviews, enforce governance, and gain deep insights into your team's pull request workflow with AI-powered analysis.
          </p>
        </div>
        <div className="flex gap-4 pt-2">
          <Button size="lg" className="gap-2 shimmer" onClick={() => onNavigate('repos')}>
            <Zap size={20} />
            Connect Repository
          </Button>
          <Button 
              variant="glass" 
              size="lg" 
              className="border-white/10 hover:bg-white/5"
              onClick={() => window.open('https://docs.lynxis.ai', '_blank')}
          >
            View Documentation
          </Button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-reveal delay-1">
        {isLoading ? (
            Array(4).fill(0).map((_, i) => (
                <Card key={i} className="h-32 animate-pulse bg-white/[0.02] border-white/5"><div /></Card>
            ))
        ) : (
            <>
                <KPICard 
                    icon={<GitPullRequest size={24} className="text-[var(--accent-primary)]" />} 
                    label="Open PRs" 
                    value={stats?.openPrs.toString() || "0"} 
                    change={stats?.openPrs === 0 ? "No active PRs" : "Active monitoring"} 
                />
                <KPICard 
                    icon={<Shield size={24} className={stats?.securityRisks && stats.securityRisks > 0 ? "text-[var(--danger)]" : "text-[var(--success)]"} />} 
                    label="Security Risks" 
                    value={stats?.securityRisks.toString() || "0"} 
                    change={stats?.securityRisks && stats.securityRisks > 0 ? "Action required" : "System secure"} 
                />
                <KPICard 
                    icon={<Zap size={24} className="text-[var(--warning)]" />} 
                    label="Review Time" 
                    value={stats?.reviewTime || "--"} 
                    change="Avg. turnaround" 
                />
                <KPICard 
                    icon={<Activity size={24} className="text-[var(--success)]" />} 
                    label="Health Score" 
                    value={stats?.healthScore || "--"} 
                    change="Based on resolutions" 
                />
            </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-reveal delay-2">
        <Card className="lg:col-span-2 space-y-8 bg-white/[0.01] border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <p className="text-sm text-[var(--text-muted)]">Real-time alerts and state changes.</p>
            </div>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
                {recentActivity.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[var(--text-muted)] italic">No recent activity found.</p>
                ) : (
                    recentActivity.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} onClick={() => markAsRead(activity.id)} />
                    ))
                )}
            </AnimatePresence>
          </div>
        </Card>

        <Card className="bg-white/[0.01] border-white/5">
          <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Review Queue</h2>
              <p className="text-sm text-[var(--text-muted)]">PRs awaiting your attention.</p>
          </div>
          <div className="space-y-4">
              {stats?.openPrs === 0 ? (
                  <p className="py-4 text-center text-sm text-[var(--text-muted)] italic">Queue is empty.</p>
              ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-40">
                      <CheckCircle2 size={40} className="text-[var(--success)] mb-4" />
                      <p className="text-sm font-medium text-white">All caught up!</p>
                  </div>
              )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const KPICard = ({ icon, label, value, change }: any) => (
  <Card className="flex flex-col gap-4 border-white/5 bg-white/[0.02] hover:border-[var(--accent-primary)]/20 shadow-none transition-all hover:translate-y-[-2px]">
    <div className="flex items-center justify-between">
      <div className="rounded-xl bg-white/5 p-2.5 text-white shadow-inner">{icon}</div>
      <Badge variant="neutral" className="bg-white/5 text-[10px] tracking-tight">{change}</Badge>
    </div>
    <div className="space-y-1 pt-2">
      <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-extrabold text-white">{value}</h3>
    </div>
  </Card>
);

const ActivityItem = ({ activity, onClick }: { activity: any, onClick: () => void }) => {
    const icons: any = {
        info: <Info size={14} className="text-[var(--accent-primary)]" />,
        success: <CheckCircle2 size={14} className="text-[var(--success)]" />,
        warning: <AlertCircle size={14} className="text-[var(--warning)]" />,
        error: <AlertCircle size={14} className="text-[var(--danger)]" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-4 p-4 rounded-xl border border-white/5 transition-all ${activity.read ? 'opacity-40 grayscale-[0.5]' : 'bg-white/[0.02] shadow-sm hover:bg-white/[0.04]'}`}
            onClick={onClick}
        >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                {icons[activity.type] || <Info size={14} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{activity.title}</h4>
                    <span className="text-[10px] font-medium text-[var(--text-muted)] shrink-0">
                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{activity.description}</p>
            </div>
        </motion.div>
    );
};

export default DashboardHome;
