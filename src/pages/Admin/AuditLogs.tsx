import { Terminal, Search, Calendar, Download } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';

const AuditLogs = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white tracking-tight text-gradient">Audit Logs</h2>
          <p className="text-[var(--text-muted)]">Immutable governance trailing and system orchestration logs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="gap-2 h-11 border-white/5 bg-white/5">
            <Calendar size={18} />
            Time Range
          </Button>
          <Button variant="secondary" className="gap-2 bg-white/5 text-white">
            <Download size={18} />
            Export Data
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
        <Input className="pl-12 bg-white/[0.02] border-white/5 h-12" placeholder="Scan audit signatures or event IDs..." />
      </div>

      <Card className="p-8 border-white/5 bg-white/[0.01] border-dashed">
        <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/10 mb-2">
                <Terminal size={32} />
            </div>
            <div>
                <h4 className="text-xl font-bold text-white">Live Logs Offline</h4>
                <p className="text-[var(--text-muted)] max-w-sm mx-auto mt-2">Connecting to the orchestration engine to stream governance events. Ensure Audit Cluster is operational.</p>
            </div>
            <div className="pt-4">
                <Badge variant="neutral" className="bg-white/5 animate-pulse">Waiting for Socket...</Badge>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogs;
