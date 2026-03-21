import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle2, ShieldAlert, MessageSquare, GitMerge, Zap, Loader2, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { AIReviewCard } from '../../components/reviews/AIReviewCard';
import InlineCommentList, { type ReviewComment } from '../../components/reviews/InlineCommentList';

const PRReviewViewer = ({ repoId, prNumber: initialPrNumber }: { repoId?: string, prNumber?: number }) => {
  const [pr, setPr] = useState<any>(null);
  const [findings, setFindings] = useState<ReviewComment[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeRepoId, setActiveRepoId] = useState<string | null>(null);

  const fetchPRData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null); // Clear previous errors
      let effectiveRepoId = repoId;
      if (!effectiveRepoId) {
        const reposRes = await fetch('http://localhost:4003/api/repos', { credentials: 'include' });
        if (reposRes.ok) {
           const repos = await reposRes.json();
           const connected = repos.find((r: any) => r.status === 'connected');
           if (connected) effectiveRepoId = connected.id;
        } else {
           setErrorMsg(`Failed repos fetch: ${reposRes.status} ${await reposRes.text()}`);
        }
      }

      if (!effectiveRepoId) {
        setPr(null);
        setIsLoading(false);
        return;
      }
      
      setActiveRepoId(effectiveRepoId);

      // If no PR number given, fetch the first open PR for the repo
      let targetPrNumber = initialPrNumber;
      if (!targetPrNumber) {
        const prsRes = await fetch(`http://localhost:4003/api/repos/${effectiveRepoId}/prs`, { credentials: 'include' });
        if (prsRes.ok) {
          const prs = await prsRes.json();
          if (prs.length > 0) targetPrNumber = prs[0].number;
          else setErrorMsg(`No PRs found in array for repo ${effectiveRepoId}.`);
        } else {
           setErrorMsg(`Failed PRs fetch: ${prsRes.status} ${await prsRes.text()}`);
        }
      }

      if (targetPrNumber) {
        const prRes = await fetch(`http://localhost:4003/api/repos/${effectiveRepoId}/prs/${targetPrNumber}`, { credentials: 'include' });
        if (prRes.ok) {
          const prData = await prRes.json();
          setPr(prData);
          setAiFeedback(prData.aiFeedback);
          setLastScannedAt(prData.lastScannedAt);
          setErrorMsg(null);
        } else {
            setErrorMsg(`Failed PR detail fetch for ${targetPrNumber}: ${prRes.status} ${await prRes.text()}`);
            setPr(null);
        }
      } else {
          setPr(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch PR data:', error);
      setErrorMsg(`Exception: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPRData();
  }, [repoId, initialPrNumber]);

  useEffect(() => {
    if (pr?.aiFeedback) {
      if (typeof pr.aiFeedback === 'object' && pr.aiFeedback.findings) {
        setFindings(Array.isArray(pr.aiFeedback.findings) ? pr.aiFeedback.findings : []);
        setAiFeedback(pr.aiFeedback.summary || 'Summary unavailable');
      } else if (typeof pr.aiFeedback === 'string') {
        // Fallback for raw string feedback
        setAiFeedback(pr.aiFeedback);
        setFindings([]);
      }
    } else {
        setFindings([]);
        setAiFeedback(null);
    }
  }, [pr]);

  const toggleResolve = async (id: string) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, resolved: !f.resolved } : f));
  };

  const handleFeedback = async (id: string, type: 'up' | 'down') => {
      console.log(`Feedback ${type} for ${id}`);
  };

  const handleRunAIScan = useCallback(async () => {
    let effectiveRepoId = activeRepoId || repoId;
    if (!effectiveRepoId) {
       // fallback if somehow activeRepoId isn't set
       if (pr?.repositoryId) effectiveRepoId = pr.repositoryId;
       else {
           const reposRes = await fetch('http://localhost:4003/api/repos', { credentials: 'include' });
           if (reposRes.ok) {
              const repos = await reposRes.json();
              const connected = repos.find((r: any) => r.status === 'connected');
              if (connected) effectiveRepoId = connected.id;
           }
       }
    }

    if (!effectiveRepoId || !pr) return;
    setIsAiLoading(true);
    setAiFeedback(null);
    setFindings([]);
    
    try {
      const response = await fetch(`http://localhost:4003/api/repos/${effectiveRepoId}/prs/${pr.number}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
      });
      
      if (response.ok) {
          const updatedPr = await response.json();
          setPr(updatedPr); // This will trigger the findings sync Effect
          setLastScannedAt(new Date().toISOString());
      } else {
          const err = await response.json();
          console.error('Scan failed:', err.error);
          alert(`Scan failed: ${err.error || 'Check server logs'}`);
      }
    } catch (error) {
      console.error('Error during AI scan:', error);
      alert('Network error while triggering AI scan.');
    } finally {
      setIsAiLoading(false);
    }
  }, [repoId, activeRepoId, pr]);

  const handleRunStaticScan = useCallback(async () => {
    setIsScanning(true);
    try {
      // Logic for real static scan would go here
      // For now, we just clear previous scan if any or show no issues found
      setFindings([]);
    } catch (error) {
      console.error('Static scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  if (isLoading) return (
    <div className="flex justify-center p-40">
      <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
    </div>
  );

  if (!pr) return (
    <div className="text-center p-40">
      <p className="text-[var(--text-muted)] italic">No open pull requests found for this repository.</p>
      {errorMsg && (
        <div className="mt-4 inline-block bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-left text-xs font-mono w-full max-w-2xl break-all">
          <p className="font-bold mb-2">Diagnostic Data:</p>
          {errorMsg}
        </div>
      )}
    </div>
  );

  const resolvedCount = findings.filter(f => f?.resolved).length;

  return (
    <div className="space-y-12 animate-reveal">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <GitPullRequest size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">PR #{pr.number}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">{pr.title}</h1>
          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center gap-2">
                {pr.authorAvatar ? (
                    <img src={pr.authorAvatar} className="h-6 w-6 rounded-full border border-white/10" alt={pr.author} />
                ) : (
                    <div className="h-6 w-6 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30" />
                )}
            <span className="font-bold text-white">{pr.author}</span>
            </span>
            <span className="flex items-center gap-2">
              <Badge variant="neutral" className="bg-white/5 border-white/10">{pr.createdAt ? new Date(pr.createdAt).toLocaleDateString() : 'Just now'}</Badge>
              <Badge variant="neutral" className="bg-white/5 border-white/10">+{pr.additions || 0} -{pr.deletions || 0}</Badge>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="glass" 
            id="btn-ai-scan"
            className="gap-2 bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] shimmer"
            onClick={handleRunAIScan}
            disabled={isAiLoading}
          >
            {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isAiLoading ? 'AI is reviewing...' : aiFeedback ? 'Re-scan with AI' : 'Scan with AI'}
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="gap-2 h-11 border-white/5 bg-white/5"
            onClick={handleRunStaticScan}
            disabled={isScanning}
          >
            {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Static Scan
          </Button>
          <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <GitMerge size={20} />
                View on GitHub
            </Button>
          </a>
        </div>
      </div>
 
      {aiFeedback && (
        <AIReviewCard feedback={aiFeedback} lastScannedAt={lastScannedAt || undefined} />
      )}
 
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Finding List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Review Findings
              <Badge variant="primary" className="bg-[var(--accent-primary)]/10">{findings.length}</Badge>
            </h2>
            <div className="text-sm text-[var(--text-muted)] font-medium">
              {resolvedCount} of {findings.length} resolved
            </div>
          </div>

          <div className="space-y-4">
            {findings.length === 0 && !isScanning && (
                <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                    <CheckCircle2 size={48} className="text-[var(--success)] opacity-20 mb-4" />
                    <p className="text-[var(--text-muted)] italic">No issues found. Run a scan to analyze the code.</p>
                </div>
            )}
            <InlineCommentList 
              comments={findings}
              onResolve={toggleResolve}
              onFeedback={handleFeedback}
            />
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-t-transparent" />
                  <p className="text-[var(--text-muted)]">Claude is analyzing your code for security and logic issues...</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Insights & Stats */}
        <div className="space-y-6">
          <Card className="bg-white/[0.01] border-white/5 shadow-none">
            <h3 className="text-xl font-bold text-white mb-6">Review Statistics</h3>
            <div className="space-y-6">
              <StatItem label="Changed Files" value={pr.changedFiles} />
              <StatItem label="Additions" value={pr.additions} />
              <StatItem label="Deletions" value={pr.deletions} />
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
                <Button variant="glass" className="w-full gap-2 bg-white/5 border-white/10">
                    <MessageSquare size={18} />
                    Add Global Comment
                </Button>
            </div>
          </Card>

          <Card className="bg-white/[0.01] border-white/5 shadow-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={80} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">Security Confidence</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">Based on static analysis and AI heuristics.</p>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isScanning ? '50%' : (pr.healthScore != null ? `${pr.healthScore}%` : '0%') }}
                    transition={{ duration: isScanning ? 2 : 0.5, repeat: isScanning ? Infinity : 0 }}
                    className="h-full bg-[var(--grad-primary)] shadow-[0_0_10px_var(--accent-primary)]" 
                />
            </div>
            <p className="mt-3 text-right text-xs font-bold text-[var(--accent-primary)]">
                {isScanning ? 'Analyzing...' : (pr.healthScore != null ? `${pr.healthScore}% Health` : 'Not Scanned')}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: any) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0 group">
    <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">{label}</span>
    <span className="text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg">{value}</span>
  </div>
);

export default PRReviewViewer;
