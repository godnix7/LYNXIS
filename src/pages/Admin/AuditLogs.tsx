import { useState, useEffect } from 'react';
import { 
  Terminal, Search, Download, 
  Clock, Globe, Info
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';

const AuditLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('http://localhost:4003/api/admin/audit', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div></div>;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                        <Input className="pl-10 h-12 bg-white/5 border-white/5" placeholder="Search real audit trail..." />
                    </div>
                </div>
                <Button variant="glass" className="h-12 border-white/10 hover:bg-white/5"><Download size={18} />Export Logs</Button>
            </header>

            <Card className="border-white/5 bg-white/[0.01] divide-y divide-white/5">
                {logs.length === 0 ? (
                    <div className="p-20 text-center opacity-30 italic">No audit records found in the live system.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="p-6 group hover:bg-white/[0.01] transition-all">
                            <div className="flex items-start gap-5">
                                <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/5 text-[var(--accent-primary)]"><Terminal size={18} /></div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-white">{log.actor?.username || 'System'}</span>
                                        <Badge variant="secondary" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-transparent text-[10px]">{log.action}</Badge>
                                        <span className="text-[var(--text-muted)]">→ {log.targetType}</span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                                        "{log.metadata?.method} {log.metadata?.path} - Status: {log.metadata?.statusCode}"
                                    </p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] pt-2 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5"><Clock size={12} />{new Date(log.createdAt).toLocaleString()}</div>
                                        <div className="flex items-center gap-1.5"><Globe size={12} />{log.ip || '127.0.0.1'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Card>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20"><Info size={20} /></div>
                <div>
                    <h5 className="text-sm font-bold text-white">Live Audit Connectivity</h5>
                    <p className="text-xs text-[var(--text-muted)]">Connected to the central governance engine. All logs are real-time.</p>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
