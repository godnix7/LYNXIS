import React, { useState } from 'react';
import { Copy, Check, Clock, Activity, ShieldAlert, Zap, FileJson } from 'lucide-react';

export interface ReviewScorecardProps {
  security_score: number;
  quality_score: number;
  logic_score: number;
  test_score: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  suggestion_count: number;
  lines_added: number;
  lines_removed: number;
  files_changed: number;
  pr_title: string;
  pr_number: number;
  reviewed_at: string;
}

const getScoreColorInfo = (score: number) => {
  if (score >= 8) return { text: 'text-green-400', bg: 'bg-green-400' };
  if (score >= 5) return { text: 'text-amber-400', bg: 'bg-amber-400' };
  return { text: 'text-red-400', bg: 'bg-red-400' };
};

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ReactNode }) => {
  const { text, bg } = getScoreColorInfo(score);
  
  return (
    <div className="flex flex-col gap-2 bg-slate-800/60 rounded-lg p-3.5 border border-slate-700/50 shadow-inner">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          {Icon}
          {label}
        </div>
        <span className={`font-bold ${text}`}>{score}/10</span>
      </div>
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div 
          className={`h-full rounded-full ${bg} transition-all duration-1000 ease-out`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default function ReviewScorecard(props: ReviewScorecardProps) {
  const {
    security_score,
    quality_score,
    logic_score,
    test_score,
    critical_count,
    warning_count,
    info_count,
    suggestion_count,
    lines_added,
    lines_removed,
    files_changed,
    pr_title,
    pr_number,
    reviewed_at
  } = props;

  const [copied, setCopied] = useState(false);

  const overallScore = Math.round((security_score + quality_score + logic_score + test_score) / 4);
  const overallColorInfo = getScoreColorInfo(overallScore);

  const handleCopy = () => {
    const summary = `## Lynxis Review Summary - PR #${pr_number}
Overall: ${overallScore}/10
- Security: ${security_score}/10
- Code Quality: ${quality_score}/10
- Logic: ${logic_score}/10
- Tests: ${test_score}/10
Issues: ${critical_count} critical, ${warning_count} warning${warning_count !== 1 ? 's' : ''}, ${info_count} info`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 flex flex-col gap-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-indigo-500 w-1.5 h-6 rounded-full inline-block"></span>
            Review Scorecard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Analysis for <span className="text-slate-300 font-medium">{pr_title}</span>
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
          title="Copy markdown summary"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy Summary'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-900/40 p-5 rounded-xl border border-slate-700/30">
        <div className="flex flex-col items-center justify-center min-w-[140px] px-6 py-4">
          <div className="relative">
            <div className={`text-7xl font-bold tracking-tighter ${overallColorInfo.text} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
              {overallScore}
            </div>
            <span className="absolute -bottom-1 -right-4 text-xl font-bold text-slate-500">/10</span>
          </div>
          <div className="text-slate-400 text-xs mt-3 uppercase tracking-[0.2em] font-semibold">Overall Score</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          <ScoreBar 
            label="Security" 
            score={security_score} 
            icon={<ShieldAlert size={16} className="text-indigo-400" />} 
          />
          <ScoreBar 
            label="Code Quality" 
            score={quality_score} 
            icon={<FileJson size={16} className="text-indigo-400" />} 
          />
          <ScoreBar 
            label="Logic" 
            score={logic_score} 
            icon={<Zap size={16} className="text-indigo-400" />} 
          />
          <ScoreBar 
            label="Tests" 
            score={test_score} 
            icon={<Activity size={16} className="text-indigo-400" />} 
          />
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Findings Overview</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-medium transition-all hover:bg-red-400/20 cursor-default">
            <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]"></span>
            {critical_count} Critical
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium transition-all hover:bg-amber-400/20 cursor-default">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
            {warning_count} Warning{warning_count !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-sm font-medium transition-all hover:bg-blue-400/20 cursor-default">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></span>
            {info_count} Info
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium transition-all hover:bg-cyan-400/20 cursor-default">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            {suggestion_count} Suggestion{suggestion_count !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="text-slate-400 text-sm flex flex-col sm:flex-row items-center justify-between border-t border-slate-700/50 pt-5 mt-2 gap-3">
        <div className="flex items-center flex-wrap gap-x-1 justify-center">
          <span className="text-green-400 font-medium">+{lines_added}</span>
          <span>lines added,</span>
          <span className="text-red-400 font-medium ml-1">-{lines_removed}</span>
          <span>removed,</span>
          <span className="text-slate-300 font-medium ml-1">{files_changed}</span>
          <span>files changed</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
          <Clock size={14} className="text-slate-400" />
          <span>reviewed {timeAgo(reviewed_at)}</span>
        </div>
      </div>
    </div>
  );
}
