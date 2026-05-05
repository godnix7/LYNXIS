import React from 'react';
import { Key, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { Card, Input, Button, cn } from '../ui';

interface AIKey {
  id: string;
  name: string;
  icon: React.ElementType;
  placeholder: string;
  color: string;
}

const AGENTS: AIKey[] = [
  { id: 'anthropic', name: 'Anthropic Claude', icon: Zap, placeholder: 'sk-ant-...', color: 'text-orange-400' },
  { id: 'openai', name: 'OpenAI GPT', icon: Sparkles, placeholder: 'sk-...', color: 'text-green-400' },
  { id: 'gemini', name: 'Google Gemini', icon: Shield, placeholder: 'AIza...', color: 'text-blue-400' },
];

interface MultiAIKeyBarProps {
  keys: { [key: string]: string };
  onKeyChange: (id: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  hasSaved: boolean;
}

export const MultiAIKeyBar = ({ keys, onKeyChange, onSave, isSaving, hasSaved }: MultiAIKeyBarProps) => {
  return (
    <Card className="border-white/5 bg-white/[0.01] p-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10">
            <Key size={20} className="text-[var(--accent-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Multi-Agent Gateway</h3>
            <p className="text-xs text-[var(--text-muted)]">Configure keys for cross-model intelligence</p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={onSave} 
          isLoading={isSaving}
          className="rounded-full px-6"
        >
          {hasSaved ? <><CheckCircle2 size={16} className="mr-2" /> Synced</> : 'Sync Keys'}
        </Button>
      </div>

      <div className="divide-y divide-white/5">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="p-6 group hover:bg-white/[0.01] transition-colors">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className={cn("p-2 rounded-lg bg-white/5", agent.color)}>
                  {React.createElement(agent.icon as any, { size: 18 })}
                </div>
                <span className="text-sm font-semibold text-white">{agent.name}</span>
              </div>
              
              <div className="flex-1 relative">
                <Input
                  type="password"
                  placeholder={agent.placeholder}
                  value={keys[agent.id] || ''}
                  onChange={(e) => onKeyChange(agent.id, e.target.value)}
                  className="bg-black/20 border-white/5 focus:border-[var(--accent-primary)]/30 h-11"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                   {keys[agent.id] ? (
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                   ) : (
                     <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <p className="text-[10px] text-center text-[var(--text-muted)] uppercase tracking-widest font-medium">
          Keys are encrypted and stored in local volatile memory (AES-256 equivalent browser storage)
        </p>
      </div>
    </Card>
  );
};
