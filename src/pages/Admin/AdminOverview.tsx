import { useState, useEffect } from 'react';
import { 
  Users, GitPullRequest, Activity, 
  TrendingUp, Clock, ShieldCheck, Zap
} from 'lucide-react';
import { Card, Badge } from '../../components/ui';

const AdminOverview = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeReviews: 0, securityEvents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:4003/api/admin/stats', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div></div>;

    return (
        <div className="space-y-8 pb-12">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    label="Total Users" 
                    value={stats.totalUsers.toLocaleString()} 
                    change="+12%" 
                    icon={Users} 
                    color="primary"
                />
                <KPICard 
                    label="Active Reviews" 
                    value={stats.activeReviews} 
                    change="+5" 
                    icon={GitPullRequest} 
                    color="secondary"
                />
                <KPICard 
                    label="Threats Blocked" 
                    value={stats.securityEvents} 
                    status={stats.securityEvents === 0 ? 'Clean' : 'Secured'}
                    icon={ShieldCheck} 
                    color={stats.securityEvents === 0 ? 'success' : 'warning'}
                />
                <KPICard 
                    label="System Status" 
                    value="Online" 
                    icon={Activity} 
                    color="success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real-time feed placeholder (could also be fetched) */}
                <Card className="lg:col-span-2 p-8 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">System Activity</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1">Live orchestration and governance logs.</p>
                        </div>
                        <Badge variant="glass" className="bg-white/5">Global Feed</Badge>
                    </div>
                    <div className="space-y-6">
                        {/* No real feed implemented yet, showing empty instead of fake logs */}
                        <p className="text-center text-[var(--text-muted)] italic py-10">No recent system activity recorded.</p>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-xl font-bold text-white mb-6">Service Health</h3>
                        <div className="space-y-4">
                            <ServiceStatus label="Core API" status="online" />
                            <ServiceStatus label="AI Analysis" status="online" />
                            <ServiceStatus label="DB Cluster" status="online" />
                        </div>
                    </Card>
                    <Card className="p-8 border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5">
                        <div className="flex items-center gap-4">
                            <Zap className="text-[var(--accent-primary)]" size={32} />
                            <div>
                                <h4 className="text-lg font-bold text-white leading-tight">V2 Engine</h4>
                                <p className="text-sm text-[var(--accent-primary)] opacity-70">Real-time stats active</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const colorMap: Record<string, string> = {
    primary: 'var(--accent-primary)',
    secondary: 'var(--accent-secondary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
};

const KPICard = ({ label, value, change, status, icon: Icon, color, trend = 'up' }: any) => {
    const accentColor = colorMap[color] || colorMap.primary;
    return (
    <Card className="p-6 border-white/5 bg-white/[0.02] relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-5" style={{ backgroundColor: accentColor }} />
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/5" style={{ color: accentColor }}><Icon size={24} /></div>
            {change && <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}><TrendingUp size={12} />{change}</span>}
            {status && <Badge variant="glass" className="bg-green-500/10 text-green-400 border-green-500/20">{status}</Badge>}
        </div>
        <div>
            <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
            <p className="text-4xl font-black text-white mt-1 tracking-tight">{value}</p>
        </div>
    </Card>
    );
};

const ActivityItem = ({ actor, action, time, type }: any) => (
    <div className="flex items-start gap-4">
        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${type === 'success' ? 'bg-green-500' : 'bg-[var(--accent-primary)]'}`} />
        <div className="flex-1 space-y-1">
            <p className="text-sm leading-tight"><span className="text-white font-bold">{actor}</span><span className="text-[var(--text-muted)] ml-2">{action}</span></p>
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest"><Clock size={12} />{time}</div>
        </div>
    </div>
);

const ServiceStatus = ({ label, status }: any) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
        <span className="text-sm font-semibold text-white/70">{label}</span>
        <Badge className="bg-green-500/10 text-green-400">{status}</Badge>
    </div>
);

export default AdminOverview;
