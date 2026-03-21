import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Search, Filter, ExternalLink, GitPullRequest, Shield, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';

interface Repository {
  id: string;
  githubRepoId: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  htmlUrl: string;
  status: 'connected' | 'disconnected';
  openPRs: number;
  health: string;
  lastSync: string | null;
}

const RepoList = ({ onSelectRepo }: { onSelectRepo: (id: string) => void }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRepos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:4003/api/repos', {
          credentials: 'include'
      });
      if (res.ok) {
          const data = await res.json();
          setRepositories(data);
      }
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const connectRepo = async (repo: Repository) => {
    try {
      const res = await fetch('http://localhost:4003/api/repos/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repo),
        credentials: 'include'
      });
      if (res.ok) {
        fetchRepos(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to connect repo:', error);
    }
  };

  const disconnectRepo = async (repoId: string) => {
    try {
      const res = await fetch(`http://localhost:4003/api/repos/${repoId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchRepos();
      } else {
        const err = await res.json();
        alert(`Disconnect failed: ${err.error}`);
      }
    } catch (error) {
      console.error('Failed to disconnect repo:', error);
      alert('Network error during disconnect');
    }
  };

  const filteredRepos = repositories
    .filter(repo => 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (a.status === 'connected' ? -1 : 1));

  return (
    <div className="space-y-12 animate-reveal">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Repositories</h1>
          <p className="text-lg text-[var(--text-secondary)]">Manage your connected source code repositories.</p>
        </div>
        <Button className="gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <Plus size={20} />
          Connect New Repo
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
          <Input 
            className="pl-12 bg-white/[0.02] border-white/5 h-12" 
            placeholder="Search repositories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="glass" className="gap-2 h-12 border-white/5 bg-white/[0.02]">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-[var(--accent-primary)]" size={40} />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRepos.length === 0 && (
            <div className="text-center py-20 text-[var(--text-muted)] italic">
              No repositories found. Ensure your GitHub account is linked.
            </div>
          )}
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                  className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between bg-white/[0.01] border-white/5 hover:border-white/10 cursor-pointer" 
                  onClick={() => repo.status === 'connected' ? onSelectRepo(repo.id) : connectRepo(repo)}
              >
                <div className="flex items-center gap-6">
                  <div className={`rounded-2xl p-4 shadow-inner ${
                    repo.status === 'connected' ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'bg-white/5 text-white/10'
                  }`}>
                    <Database size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white tracking-tight">{repo.name}</h3>
                      {repo.status === 'connected' ? (
                          <Badge variant="success" className="bg-[var(--success)]/5">Connected</Badge>
                      ) : (
                          <Badge variant="neutral" className="bg-white/5">Available</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <GitPullRequest size={14} className="text-[var(--accent-primary)]" />
                        {repo.openPRs} Open PRs
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <ActivityIcon health={repo.health} />
                        Health: <span className="text-[var(--text-secondary)] capitalize">{repo.health || 'none'}</span>
                      </span>
                      <span className="font-medium">Last Sync: {repo.lastSync ? new Date(repo.lastSync).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="p-2 rounded-full">
                      <ExternalLink size={20} />
                    </Button>
                  </a>
                  <div className="h-8 w-px bg-white/5 hidden sm:block" />
                  {repo.status === 'connected' ? (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="gap-2 bg-red-500/10 border-red-500/10 text-red-500 hover:bg-red-500/20"
                      onClick={(e) => { e.stopPropagation(); disconnectRepo(repo.id); }}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      variant="glass" 
                      className="gap-2 bg-white/5 border-white/10 hover:bg-white/10"
                      onClick={(e) => { e.stopPropagation(); connectRepo(repo); }}
                    >
                      Connect
                      <ChevronRight size={18} />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActivityIcon = ({ health }: { health: string }) => {
  if (health === 'optimal') return <CheckCircle2 size={14} className="text-[var(--success)]" />;
  if (health === 'warning') return <AlertCircle size={14} className="text-[var(--warning)]" />;
  return <Shield size={14} className="text-white/20" />;
}

export default RepoList;
