import { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Trash2, LogOut, Key, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { Card, Button, Input, cn } from '../../components/ui';
import { MultiAIKeyBar } from '../../components/settings/MultiAIKeyBar';
import { useAuth } from '../../context/AuthContext';
import { useAI, AIModel } from '../../context/AIContext';

const SettingsHome = () => {
  const { user, logout } = useAuth();
  const { aiKeys, saveKeys, selectedModel, setSelectedModel, setAiKeys } = useAI();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Local keys state for the form
  const [localKeys, setLocalKeys] = useState(aiKeys);
  const [keysSaved, setKeysSaved] = useState(false);

  useEffect(() => {
    setLocalKeys(aiKeys);
  }, [aiKeys]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await fetch('http://localhost:4003/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName }),
      });
    } catch (err) { console.error('Save failed:', err); }
    finally { setSaving(false); }
  };

  const handleSaveKeys = () => {
    saveKeys(localKeys);
    setKeysSaved(true);
    setTimeout(() => setKeysSaved(false), 3000);
  };

  const sections = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Cpu, label: 'AI Configuration', id: 'ai-config' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: Lock, label: 'Security', id: 'security' },
    { icon: Globe, label: 'Integrations', id: 'integrations' },
  ];

  const models: { id: AIModel; label: string; description: string }[] = [
    { id: 'anthropic', label: 'Anthropic Claude', description: 'Advanced reasoning and code understanding.' },
    { id: 'openai', label: 'OpenAI GPT-4', description: 'Highly versatile and widely used model.' },
    { id: 'gemini', label: 'Google Gemini', description: 'Multimodal capabilities and fast responses.' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-[var(--text-secondary)]">Manage your account, AI preferences, and integrations.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-0 border-white/5 bg-white/[0.01] overflow-hidden h-fit">
          <nav className="divide-y divide-white/5">
            {sections.map((s) => (
              <button 
                key={s.id} 
                onClick={() => setActiveTab(s.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-5 py-4 text-sm font-medium transition-all",
                  activeTab === s.id 
                    ? "text-white bg-white/10" 
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
                )}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </nav>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card className="border-white/5 bg-white/[0.01] space-y-6">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-[var(--accent-primary)]" />
                  <h3 className="text-lg font-bold text-white">Profile Information</h3>
                </div>
                <div className="flex items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="h-16 w-16 rounded-2xl border border-white/10" alt="" />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-[var(--accent-primary)]/20 flex items-center justify-center text-2xl font-bold text-[var(--accent-primary)]">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-bold text-white">{user?.username}</p>
                    <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="First Name" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} />
                  <Input label="Last Name" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} />
                  <Input label="Email" value={user?.email || ''} readOnly />
                  <Input label="GitHub" value={user?.username || ''} readOnly />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} isLoading={saving} className="gap-2">Save Changes</Button>
                </div>
              </Card>

              <Card className="border-red-500/10 bg-red-500/[0.02] space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trash2 size={18} className="text-red-500" />
                  Danger Zone
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">Permanently delete your account and all associated data.</p>
                <div className="flex gap-3">
                  <Button variant="danger" className="gap-2"><Trash2 size={16} />Delete Account</Button>
                  <Button variant="ghost" className="gap-2 text-red-400" onClick={logout}><LogOut size={16} />Sign Out</Button>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'ai-config' && (
            <div className="space-y-6">
              <Card className="border-white/5 bg-white/[0.01] space-y-6">
                <div className="flex items-center gap-3">
                  <Cpu size={20} className="text-[var(--accent-primary)]" />
                  <h3 className="text-lg font-bold text-white">Default Model</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Select the default AI agent to use for code analysis and responses.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={cn(
                        "flex flex-col text-left p-4 rounded-xl border transition-all duration-300",
                        selectedModel === m.id
                          ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/40 ring-1 ring-[var(--accent-primary)]/40"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-bold mb-1",
                        selectedModel === m.id ? "text-white" : "text-[var(--text-secondary)]"
                      )}>{m.label}</span>
                      <span className="text-[10px] text-[var(--text-muted)] leading-relaxed">{m.description}</span>
                    </button>
                  ))}
                </div>
              </Card>
              <MultiAIKeyBar 
                keys={aiKeys}
                onKeyChange={(id, value) => setAiKeys({ ...aiKeys, [id]: value })}
                onSave={handleSaveKeys}
                isSaving={saving}
                hasSaved={keysSaved}
              />
              
              <Card className="border-blue-500/10 bg-blue-500/[0.02] flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 mt-1">
                  <Sparkles size={18} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Model Routing</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Lynxis automatically routes requests to the most efficient model based on your provided keys. 
                    If multiple keys are present, preference is given to <span className="text-white">Claude 3.5 Sonnet</span> for code analysis.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {(activeTab !== 'profile' && activeTab !== 'ai-config') && (
            <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-dashed border-white/10 bg-transparent">
              <div className="p-4 rounded-full bg-white/5 text-white/20">
                <Globe size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{sections.find(s => s.id === activeTab)?.label} Coming Soon</h3>
                <p className="text-sm text-[var(--text-muted)]">We're working hard to bring this feature to you.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsHome;
