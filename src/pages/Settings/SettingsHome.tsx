import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Puzzle, ShieldCheck, Mail, Bell, Save, Plus, Globe, ChevronRight } from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const SettingsHome = () => {
  const [activeTab, setActiveTab ] = useState('profile');
  const { user } = useAuth();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'team', label: 'Team', icon: <Users size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle size={18} /> },
    { id: 'rules', label: 'Rules & Governance', icon: <ShieldCheck size={18} /> },
  ];

  if (!user) return null;

  return (
    <div className="space-y-12 animate-reveal">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tighter text-white">Settings</h1>
        <p className="text-lg text-[var(--text-secondary)]">Manage your account, team, and workspace preferences.</p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="w-full lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                activeTab === tab.id 
                  ? 'bg-white/5 text-white shadow-inner border border-white/5' 
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${activeTab === tab.id ? 'text-[var(--accent-primary)]' : 'group-hover:text-white'}`}>
                  {tab.icon}
                </span>
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRight size={14} className="text-[var(--accent-primary)]" />}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'profile' && <ProfileSettings user={user} />}
              {activeTab === 'team' && <TeamSettings />}
              {activeTab === 'integrations' && <IntegrationSettings />}
              {activeTab === 'rules' && <GovernanceSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = ({ user }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    bio: user.bio || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { fetchUser } = useAuth();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:4003/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (res.ok) {
        await fetchUser();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username;

  return (
    <Card className={cn(
        "space-y-10 bg-white/[0.01] border-white/5 md:p-10 transition-all duration-500",
        isEditing && "border-[var(--accent-primary)]/30 shadow-[0_0_50px_rgba(59,130,246,0.1)] ring-1 ring-[var(--accent-primary)]/20"
    )}>
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
          <div className="flex items-center gap-8">
            <div className="relative group">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="h-24 w-24 rounded-full border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] object-cover" />
                ) : (
                    <div className="h-24 w-24 rounded-full bg-[var(--grad-primary)] shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-105" />
                )}
                {isEditing && (
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 border-2 border-dashed border-[var(--accent-primary)]/50">
                      <Badge className="bg-[var(--accent-primary)]/20 text-white">Change</Badge>
                    </button>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white leading-tight">{displayName}</h3>
                <p className="text-[var(--text-secondary)]">
                    {user.bio || 'Product Developer'} • <span className="text-[var(--text-muted)] italic">Personal Account</span>
                </p>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="secondary" size="sm" className="bg-white/5 border-white/10" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex items-center gap-2">
                <Badge variant="primary" className="animate-pulse">Editing Mode</Badge>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Input 
            label="First Name" 
            value={formData.firstName} 
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            readOnly={!isEditing} 
            placeholder="No first name set"
            className={isEditing ? "focus:bg-white/[0.03]" : ""}
          />
          <Input 
            label="Last Name" 
            value={formData.lastName} 
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            readOnly={!isEditing} 
            placeholder="No last name set"
            className={isEditing ? "focus:bg-white/[0.03]" : ""}
          />
          <div className="md:col-span-2">
            <Input 
              label="Email Address (Linked GitHub)" 
              value={user.email || 'No email linked'} 
              readOnly 
              className="opacity-40 grayscale"
            />
          </div>
          <div className="md:col-span-2">
              <Input 
                label="Professional Bio" 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Write a brief bio about yourself..." 
                readOnly={!isEditing}
                className={isEditing ? "focus:bg-white/[0.03]" : ""}
              />
          </div>
        </div>

        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-3 pt-6 border-t border-white/5"
          >
              <Button variant="ghost" className="hover:bg-white/5" onClick={() => { setIsEditing(false); setFormData({ firstName: user.firstName || '', lastName: user.lastName || '', bio: user.bio || '' }); }}>Cancel</Button>
              <Button className="gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)]" onClick={handleSave} isLoading={isSaving}>
                <Save size={18} />
                Save Changes
              </Button>
          </motion.div>
        )}
    </Card>
  );
};

const TeamSettings = () => (
    <Card className="space-y-8 bg-white/[0.01] border-white/5 md:p-10">
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-2xl font-bold text-white">Team Members</h3>
          <p className="text-[var(--text-muted)]">Manage who has access to your reviews.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => alert('Inviting team members is coming soon!')}>
          <Plus size={16} />
          Invite
        </Button>
      </div>
      
      <div className="space-y-1 py-10 text-center">
        <Users size={40} className="mx-auto text-white/10 mb-4" />
        <p className="text-[var(--text-muted)] italic">No team members found. Invite others to collaborate.</p>
      </div>
    </Card>
);

const IntegrationSettings = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <IntegrationCard 
        name="GitHub" 
        icon={<Globe className="text-[#FFFFFF]" />} 
        status="active" 
        desc="Successfully connected. Syncing PRs and commit history."
        color="#24292e"
      />
      <div className="md:col-span-2 p-8 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] text-center">
          <p className="text-[var(--text-muted)] italic text-sm">More integrations (Slack, Jira, etc.) are currently in development.</p>
      </div>
    </div>
);

const GovernanceSettings = () => {
    const [showDeleteModal, setShowDeleteModal ] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!/^\d{6}$/.test(twoFACode)) {
            alert('Please enter a valid 6-digit confirmation code.');
            return;
        }
        setIsDeleting(true);
        try {
            const res = await fetch('http://localhost:4003/api/users/me', {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Failed to delete account:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
      <Card className="space-y-10 bg-white/[0.01] border-white/5 md:p-10">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Global Rules</h3>
          <p className="text-[var(--text-muted)]">Configure enforcement levels for your workspace.</p>
        </div>
    
        <div className="space-y-6">
          <RuleToggle 
            title="Require Multi-Review" 
            desc="Primacy rule enforcing at least 2 manual approvals for core modules."
            active={true}
          />
          <RuleToggle 
            title="Block Security Dangers" 
            desc="Automatically block merges if critical security risks are detected."
            active={true}
          />
          <RuleToggle 
            title="Lint Compliance" 
            desc="Ensure all stylistic findings are resolved before merge."
            active={false}
          />
        </div>
    
        <div className="p-6 rounded-2xl bg-[var(--danger)]/5 border border-[var(--danger)]/10 space-y-4">
            <h4 className="font-bold text-[var(--danger)]">Danger Zone</h4>
            <p className="text-sm text-[var(--text-muted)]">Deleting your account will permanently remove all review history, linked repositories, and personal data.</p>
            <Button variant="danger" className="w-full" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
        </div>

        <AnimatePresence>
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md glass p-8 rounded-3xl border-white/10 space-y-6"
                    >
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">Confirm Deletion</h3>
                            <p className="text-sm text-[var(--text-muted)]">This action is irreversible. Please enter the 2FA code sent to your email to proceed.</p>
                        </div>

                        <Input 
                            label="2FA Code" 
                            placeholder="Enter 123456" 
                            value={twoFACode}
                            onChange={(e) => setTwoFACode(e.target.value)}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button variant="danger" className="flex-1" onClick={handleDelete} isLoading={isDeleting}>Confirm Delete</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </Card>
    );
};

const IntegrationCard = ({ name, icon, status, desc, color }: any) => (
  <Card className="flex flex-col gap-6 bg-white/[0.01] border-white/5 hover:border-white/10">
    <div className="flex items-center justify-between">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border border-white/5" style={{ backgroundColor: `${color}10` }}>
        <div style={{ color: color }}>{icon}</div>
      </div>
      <Badge variant={status === 'active' ? 'success' : 'neutral'}>
        {status}
      </Badge>
    </div>
    <div className="space-y-2">
      <h4 className="text-xl font-bold text-white tracking-tight">{name}</h4>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
    </div>
    <Button variant="glass" className="w-full text-xs py-2 bg-white/5 border-white/5 hover:bg-white/10">
      {status === 'active' ? 'Configure' : 'Enable'}
    </Button>
  </Card>
);

const RuleToggle = ({ title, desc, active }: any) => (
  <div className="flex items-start justify-between gap-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
    <div className="space-y-2">
      <h4 className="font-bold text-white transition-colors group-hover:text-[var(--accent-primary)]">{title}</h4>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
    </div>
    <div className={`h-6 w-11 rounded-full p-1 transition-all ${active ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}`}>
      <div className={`h-4 w-4 rounded-full bg-white shadow-lg transition-all ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default SettingsHome;
