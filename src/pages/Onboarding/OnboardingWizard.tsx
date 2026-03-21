import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Database, Users, User, ChevronRight, ChevronLeft, Check, Loader2 
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const steps = [
  { id: 1, title: 'Profile', icon: <User size={20} />, desc: 'Tell us who you are.' },
  { id: 2, title: 'Team', icon: <Users size={20} />, desc: 'Invite your collaborators.' },
  { id: 3, title: 'Repositories', icon: <Database size={20} />, desc: 'Connect your first repo.' },
];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const { completeOnboarding } = useAuth();

  const fetchRepos = async () => {
    setIsLoadingRepos(true);
    try {
      const res = await fetch('http://localhost:4003/api/repos', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      }
    } catch (e) {
      console.error('Failed to fetch repos in onboarding:', e);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 2) {
        // Fetch repos when moving to step 3
        fetchRepos();
    }

    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else {
        // If we selected a repo, connect it first
        if (selectedRepoId) {
            const repoToConnect = repos.find(r => r.id === selectedRepoId || r.githubRepoId.toString() === selectedRepoId);
            if (repoToConnect) {
                try {
                    await fetch('http://localhost:4003/api/repos/connect', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(repoToConnect),
                        credentials: 'include'
                    });
                } catch (e) {
                    console.error('Failed to connect repo during onboarding', e);
                }
            }
        }
        completeOnboarding(profileData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <div className="mesh-glow" />
      
      <div className="w-full max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 animate-reveal">
          <Badge variant="primary" className="bg-[var(--accent-primary)]/10 px-4 py-1.5 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            Setup Wizard
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white md:text-6xl">
            Let's <span className="text-gradient">Configure</span> Your Workspace.
          </h1>
        </div>

        {/* Stepper */}
        <div className="relative flex items-center justify-between px-12 animate-reveal delay-1">
          <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-white/5 z-0" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 shadow-xl ${
                  currentStep >= step.id 
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-[#050505] border-white/10 text-[var(--text-muted)]'
                }`}
              >
                {currentStep > step.id ? <Check size={20} /> : step.icon}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${
                currentStep >= step.id ? 'text-white' : 'text-[var(--text-muted)]'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form area */}
        <Card className="min-h-[400px] bg-white/[0.01] border-white/5 p-10 flex flex-col justify-between animate-reveal delay-2">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                >
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{steps[currentStep-1].title} Details</h2>
                        <p className="text-[var(--text-secondary)] font-medium">{steps[currentStep-1].desc}</p>
                    </div>

                    <div className="space-y-6">
                        {currentStep === 1 && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input 
                                    label="First Name" 
                                    placeholder="e.g. Nischay" 
                                    value={profileData.firstName}
                                    onChange={(e: any) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                                />
                                <Input 
                                    label="Last Name" 
                                    placeholder="e.g. Saha" 
                                    value={profileData.lastName}
                                    onChange={(e: any) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                                />
                                <div className="md:col-span-2">
                                    <Input 
                                        label="Professional Bio" 
                                        placeholder="Tell us about your role..." 
                                        value={profileData.bio}
                                        onChange={(e: any) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    />
                                </div>
                            </div>
                        )}
                        {currentStep === 2 && <TeamStep />}
                        {currentStep === 3 && (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingRepos ? (
                                    <div className="flex justify-center p-10">
                                        <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
                                    </div>
                                ) : repos.length === 0 ? (
                                    <p className="text-center text-[var(--text-muted)] py-10 italic italic italic italic">
                                        No repositories found. Ensure your GitHub account is linked.
                                    </p>
                                ) : (
                                    repos.map((repo) => (
                                        <div 
                                            key={repo.id} 
                                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all group ${
                                                selectedRepoId === repo.id 
                                                    ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/50' 
                                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                            }`}
                                            onClick={() => setSelectedRepoId(repo.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Database size={20} className={selectedRepoId === repo.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors'} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{repo.name}</span>
                                                    <span className="text-[10px] text-[var(--text-muted)]">{repo.fullName}</span>
                                                </div>
                                            </div>
                                            <div className={`h-5 w-5 rounded-full border transition-all flex items-center justify-center ${
                                                selectedRepoId === repo.id 
                                                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]' 
                                                    : 'border-white/10 group-hover:border-[var(--accent-primary)]'
                                            }`}>
                                                {selectedRepoId === repo.id && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                {currentStep > 1 && (
                    <Button 
                        variant="ghost" 
                        onClick={prevStep} 
                        className="gap-2 text-[var(--text-muted)] hover:text-white"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </Button>
                )}
                <Button 
                    onClick={nextStep} 
                    className={`gap-2 px-8 shadow-[0_0_20px_rgba(59,130,246,0.2)] ${currentStep === 1 ? 'ml-auto' : ''}`}
                    disabled={currentStep === 3 && !selectedRepoId}
                >
                    {currentStep === 3 ? 'Complete Setup' : 'Continue'}
                    <ChevronRight size={20} />
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
};


const TeamStep = () => (
    <div className="space-y-6">
        <p className="text-[var(--text-muted)] italic text-sm py-8 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            Team collaboration and organization discovery feature is coming soon.
        </p>
        <Input label="Direct Invitation" placeholder="Invite link will be generated after setup..." disabled />
    </div>
);

export default OnboardingWizard;
