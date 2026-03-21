import { motion } from 'framer-motion';
import { Bot, Sparkles, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { Card, Badge } from '../ui';

interface AIReviewCardProps {
  feedback: string;
  lastScannedAt?: string;
}

/** Lightweight markdown-to-JSX renderer for AI review output */
const renderMarkdown = (text: any) => {
  if (!text) return [];
  const safeText = typeof text === 'string' ? text : JSON.stringify(text);
  const lines = safeText.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let key = 0;

  const flush = () => {
    if (codeBuffer.length > 0) {
      elements.push(
        <pre key={key++} className="bg-black/40 border border-white/10 p-4 rounded-xl overflow-x-auto mb-6 scrollbar-thin text-sm font-mono text-[var(--text-secondary)]">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
      codeBuffer = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) { flush(); inCodeBlock = false; }
      else { inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { codeBuffer.push(line); continue; }

    if (line.startsWith('## ')) {
      const heading = line.slice(3);
      const icon = getHeaderIcon(heading);
      elements.push(
        <h2 key={key++} className="text-lg font-bold text-white mt-8 mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
          {icon}{heading}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-xl font-extrabold text-white mt-6 mb-3">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={key++} className="ml-5 list-disc text-[var(--text-secondary)] leading-relaxed marker:text-[var(--accent-primary)]">
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (line.trim() === '') {
      // skip blank
    } else {
      elements.push(<p key={key++} className="text-[var(--text-secondary)] leading-relaxed mb-4">{renderInline(line)}</p>);
    }
  }
  flush();
  return elements;
};

/** Inline markdown: bold, inline code */
const renderInline = (text: string) => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;
  // Match **bold**, `code`
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) parts.push(remaining.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={k++} className="text-white font-bold">{match[2]}</strong>);
    else if (match[3]) parts.push(<code key={k++} className="bg-white/5 px-1.5 py-0.5 rounded text-[var(--accent-primary)] font-mono text-sm">{match[3]}</code>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < remaining.length) parts.push(remaining.slice(lastIndex));
  return parts;
};

export const AIReviewCard = ({ feedback, lastScannedAt }: AIReviewCardProps) => {
  if (!feedback) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-[var(--accent-primary)]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--grad-primary)] flex items-center justify-center shadow-lg">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  LynxisAI Review
                  <Sparkles size={16} className="text-[var(--accent-primary)]" />
                </h3>
                {lastScannedAt && (
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <Clock size={12} />
                    Scanned at {new Date(lastScannedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="primary" className="bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/20">
              AI Powered
            </Badge>
          </div>

          <div className="prose prose-invert max-w-none ai-review-content">
            {renderMarkdown(feedback)}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Zap size={14} className="text-[var(--warning)]" />
              Generated by LynxisAI
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const getHeaderIcon = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('security')) return <AlertTriangle size={18} className="text-[var(--danger)]" />;
  if (t.includes('quality')) return <ShieldCheck size={18} className="text-[var(--success)]" />;
  if (t.includes('practices')) return <Zap size={18} className="text-[var(--warning)]" />;
  return null;
};
