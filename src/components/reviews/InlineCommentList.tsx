import { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb,
  ChevronDown,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../ui';

export interface ReviewComment {
  id: string;
  file_path: string;
  line_number: number;
  severity: 'critical' | 'warning' | 'info' | 'suggestion';
  category: 'security' | 'bug' | 'quality' | 'tests' | 'style';
  body: string;
  suggestion: string | null;
  resolved: boolean;
  github_comment_id: number | null;
}

interface InlineCommentListProps {
  comments: ReviewComment[];
  onResolve: (id: string) => Promise<void>;
  onFeedback: (id: string, type: 'up' | 'down') => Promise<void>;
}

/**
 * InlineCommentList - Renders a filtered list of code review comments.
 */
export default function InlineCommentList({ 
  comments, 
  onResolve, 
  onFeedback 
}: InlineCommentListProps) {
  // --- State ---
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFile, setFilterFile] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- Derived State ---
  const uniqueFiles = useMemo(() => {
    if (!Array.isArray(comments)) return [];
    return Array.from(new Set(comments.map(c => c?.file_path || 'Unknown File'))).sort();
  }, [comments]);

  const filteredComments = useMemo(() => {
    if (!Array.isArray(comments)) return [];
    return comments.filter(comment => {
      const matchSeverity = filterSeverity === 'all' || comment?.severity === filterSeverity;
      const matchCategory = filterCategory === 'all' || comment?.category === filterCategory;
      const matchFile = filterFile === 'all' || (comment?.file_path || 'Unknown File') === filterFile;
      return matchSeverity && matchCategory && matchFile;
    });
  }, [comments, filterSeverity, filterCategory, filterFile]);

  // --- Handlers ---
  const handleCopyFix = async (id: string, suggestion: string) => {
    try {
      if (suggestion) {
          await navigator.clipboard.writeText(suggestion);
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // --- UI Helpers ---
  if (!Array.isArray(comments) || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="text-emerald-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No issues found</h3>
        <p className="text-slate-400 max-w-md">This PR looks clean. All systems are green!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1E293B]/50 border border-slate-800 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mr-2">
            <Filter size={16} />
            <span>Filters:</span>
          </div>
          
          {/* Severity Filter */}
          <div className="relative group">
            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 pr-8 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer transition-all hover:border-slate-600"
            >
              <option value="all">Severity: All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="suggestion">Suggestion</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Category Filter */}
          <div className="relative group">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 pr-8 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer transition-all hover:border-slate-600"
            >
              <option value="all">Category: All</option>
              <option value="security">Security</option>
              <option value="bug">Bug</option>
              <option value="quality">Quality</option>
              <option value="tests">Tests</option>
              <option value="style">Style</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* File Filter */}
          <div className="relative group">
            <select 
              value={filterFile}
              onChange={(e) => setFilterFile(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 pr-8 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer transition-all hover:border-slate-600 max-w-[200px]"
            >
              <option value="all">File: All</option>
              {uniqueFiles.map((file: string) => (
                <option key={file} value={file}>{file === 'Unknown File' ? file : file.split('/').pop()}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>
        </div>

        <div className="text-slate-400 text-xs font-mono">
          Showing <span className="text-white font-bold">{filteredComments.length}</span> of <span className="text-white font-bold">{comments.length}</span> issues
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map(comment => (
            <CommentCard 
              key={comment.id}
              comment={comment}
              onResolve={onResolve}
              onFeedback={onFeedback}
              onCopyFix={handleCopyFix}
              isCopied={copiedId === comment.id}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/50 border-dashed">
            <Search className="mx-auto text-slate-600 mb-4" size={32} />
            <p className="text-slate-400">No issues match your filters</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4"
              onClick={() => {
                setFilterSeverity('all');
                setFilterCategory('all');
                setFilterFile('all');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components ---

function CommentCard({ 
  comment, 
  onResolve, 
  onFeedback, 
  onCopyFix,
  isCopied
}: { 
  comment: ReviewComment;
  onResolve: (id: string) => void;
  onFeedback: (id: string, type: 'up' | 'down') => void;
  onCopyFix: (id: string, suggestion: string) => void;
  isCopied: boolean;
}) {
  const { id, file_path, line_number, severity, body, suggestion, resolved } = comment;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 border-slate-800",
        resolved ? "opacity-50 grayscale-[0.5] border-emerald-500/20 bg-emerald-500/5" : "bg-[#1E293B] shadow-lg shadow-black/20"
      )}
      glass={!resolved}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SeverityBadge severity={severity} />
            <div className={cn(
              "font-mono text-xs flex items-center gap-2",
              resolved ? "line-through text-emerald-400" : "text-slate-400"
            )}>
              {resolved && <Check className="text-emerald-500" size={14} />}
              <span>{file_path}</span>
              <span className="text-slate-600">:</span>
              <span className="text-indigo-400">L{line_number}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="neutral" className="bg-slate-900 border-slate-700 capitalize">
              {comment.category}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="text-slate-200 text-sm leading-relaxed">
          {typeof body === 'string' ? body : JSON.stringify(body)}
        </div>

        {/* Suggestion */}
        {suggestion && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Lightbulb size={12} />
                Proposed Fix
              </span>
              <button 
                onClick={() => onCopyFix(id, suggestion)}
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  isCopied ? "text-emerald-400" : "text-slate-500 hover:text-white"
                )}
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 size={12} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy Fix
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#0F172A] border border-slate-700/50 rounded-lg p-4 text-xs font-mono text-cyan-400 overflow-x-auto">
              <code>{typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion)}</code>
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onFeedback(id, 'up')}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-500 hover:text-indigo-400 transition-colors"
              title="Helpful"
            >
              <ThumbsUp size={16} />
            </button>
            <button 
              onClick={() => onFeedback(id, 'down')}
              className="p-1.5 rounded-md hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
              title="Not helpful"
            >
              <ThumbsDown size={16} />
            </button>
          </div>

          <Button 
            variant={resolved ? "danger" : "primary"}
            size="sm"
            className={cn(
              "h-8 px-4",
              resolved ? "bg-slate-800 border-slate-700 text-slate-400" : ""
            )}
            onClick={() => onResolve(id)}
          >
            {resolved ? "Unresolve" : "Resolve"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const configs: Record<string, any> = {
    critical: {
      label: 'CRITICAL',
      icon: AlertCircle,
      className: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    warning: {
      label: 'WARNING',
      icon: AlertTriangle,
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    info: {
      label: 'INFO',
      icon: Info,
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    suggestion: {
      label: 'SUGGESTION',
      icon: Lightbulb,
      className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    }
  };

  const safeSeverity = (severity || 'info').toLowerCase();
  const config = configs[safeSeverity] || configs['info'];
  const Icon = config.icon;

  return (
    <Badge className={cn("flex items-center gap-1.5", config.className)}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}
