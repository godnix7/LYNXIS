import { useState, useEffect } from 'react';
import { 
  GitPullRequest, CheckCircle2, AlertCircle, 
  MessageSquare, Shield, Zap, ChevronRight,
  Maximize2, Github, Layout, FileCode
} from 'lucide-react';
import { Card, Button, Badge, ErrorState } from '../../components/ui';

const PRReviewViewer = () => {
    const [prData, setPrData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchPRData = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const res = await fetch('http://localhost:4003/api/reviews/latest', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setPrData(data);
            } else {
                setErrorMsg(`Failed to fetch PR data: ${res.status}`);
            }
        } catch (err: any) {
            console.error('Failed to fetch PR data:', err);
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPRData();
    }, []);

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-transparent border-[var(--accent-primary)]"></div>
            <p className="text-sm font-bold text-[var(--accent-primary)] animate-pulse uppercase tracking-widest">Hydrating Review Data...</p>
        </div>
    );

    if (errorMsg) return (
        <div className="py-20">
            <ErrorState 
                error={errorMsg} 
                onRetry={fetchPRData}
                title={errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') ? "Review Engine Offline" : "Access Denied"}
                message={errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') 
                    ? "The Lynxis review microservices are currently unreachable. Please verify that Docker is operational." 
                    : "We encountered an issue accessing the PR review data. Please try again or contact support."
                }
            />
        </div>
    );

    if (!prData) return (
        <div className="py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/10 mx-auto mb-6">
                <Layout size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">No Active Reviews</h3>
            <p className="text-[var(--text-muted)] mt-2">Connect a repository and open a PR to see AI analysis.</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* PR Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Badge variant="primary" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex gap-1.5 items-center">
                            <Github size={12} />
                            PR #{prData.number}
                        </Badge>
                        <h1 className="text-3xl font-black text-white tracking-tight">{prData.title}</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5 font-medium"><Github size={14} /> {prData.owner}/{prData.repo}</span>
                        <ChevronRight size={14} className="opacity-20" />
                        <span className="bg-white/5 px-2 py-0.5 rounded text-white/50 font-mono text-xs">{prData.branch}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="glass" className="gap-2">
                        <Maximize2 size={18} />
                        Full Diff
                    </Button>
                    <Button className="gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <CheckCircle2 size={18} />
                        Approve
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Findings Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Shield className="text-[var(--accent-primary)]" size={20} />
                            AI Findings ({prData.findings?.length || 0})
                        </h3>
                        <Badge variant="glass" className="bg-white/5">V2 Analysis Engine</Badge>
                    </div>

                    <div className="space-y-4">
                        {(prData.findings || []).map((finding: any, idx: number) => (
                            <FindingCard key={idx} finding={finding} />
                        ))}
                    </div>
                </div>

                {/* Meta Column */}
                <div className="space-y-6">
                    <Card className="p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-lg font-bold text-white mb-6">Review Summary</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Security Priority</span>
                                <Badge variant="danger" className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Code Quality</span>
                                <Badge variant="primary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">A- Grade</Badge>
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center gap-2 text-sm text-green-400 font-bold mb-2">
                                    <CheckCircle2 size={16} />
                                    Ready for Merge
                                </div>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                    AI engine suggests merging after addressing the critical security finding in middleware.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 relative overflow-hidden group">
                        <Zap className="absolute -right-4 -bottom-4 text-[var(--accent-primary)] opacity-10 group-hover:scale-125 transition-transform" size={120} />
                        <h4 className="font-bold text-white mb-1">Ollama Logic</h4>
                        <p className="text-xs text-[var(--accent-primary)] opacity-80 leading-relaxed italic">
                            Powered by Llama3-8B local inference cluster. Analysis completed in 4.2s.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const FindingCard = ({ finding }: any) => {
    return (
        <Card className="p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group border-l-4 border-l-red-500/50">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{finding.type}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{finding.file}:{finding.line}</p>
                    </div>
                </div>
                <Badge variant="danger" className="bg-red-500/10 text-red-500">High</Badge>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-6">
                {finding.message}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="flex -space-x-2">
                    {[1, 2].map(i => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-[var(--bg-primary)] bg-white/10" />
                    ))}
                </div>
                <span className="text-xs text-[var(--text-muted)]">2 engineers discussed</span>
                <Button variant="ghost" size="sm" className="ml-auto gap-2 text-[var(--accent-primary)]">
                    <MessageSquare size={14} />
                    View Thread
                </Button>
            </div>
        </Card>
    );
};

export default PRReviewViewer;
