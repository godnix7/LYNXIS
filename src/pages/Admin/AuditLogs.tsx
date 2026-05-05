import { API_BASE_URL } from '../../config/api';
import { useState, useEffect } from 'react';
import { FileText, Clock, User, Filter } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/audit`, { credentials: 'include' });
        if (res.ok) setLogs(await res.json());
      } catch (err) { console.error('Failed:', err); }
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Audit Logs</h2>
          <p className="text-[var(--text-secondary)]">Track all administrative actions and system events.</p>
        </div>
        <Button variant="glass" className="gap-2"><Filter size={18} />Filter Events</Button>
      </div>

      <Card className="p-0 overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="px-6 py-20 text-center text-[var(--text-muted)] italic">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="px-6 py-20 text-center space-y-3">
              <FileText size={40} className="mx-auto text-white/10" />
              <p className="text-[var(--text-muted)]">No audit events recorded yet.</p>
            </div>
          ) : logs.map((log, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors">
              <div className="p-2 rounded-lg bg-white/5 mt-0.5">
                <FileText size={16} className="text-[var(--accent-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{log.action}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{log.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]"><User size={10} />{log.user}</span>
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]"><Clock size={10} />{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <Badge variant={log.severity === 'high' ? 'danger' : 'neutral'}>{log.severity || 'info'}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditLogs;
