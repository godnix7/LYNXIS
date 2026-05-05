import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, Button, Badge, ErrorState } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const STEPS = ['Connect GitHub', 'Select Repos', 'Configure', 'Complete'] as const;

const OnboardingWizard = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubConnect = () => {
    window.location.href = 'http://localhost:4003/api/auth/github';
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await fetch('http://localhost:4003/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ onboardingCompleted: true }),
      });
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <ErrorState error={error} onRetry={() => setError(null)} title="Setup Failed" message="We couldn't complete your onboarding. Please try again." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 py-16 relative">
      <div className="mesh-glow" />
      
      <div className="w-full max-w-2xl relative z-10 space-y-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((_s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                i < step ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white' :
                i === step ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' :
                'border-white/10 text-[var(--text-muted)] bg-white/5'
              }`}>
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px ${i < step ? 'bg-[var(--accent-primary)]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">{STEPS[step]}</p>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {step === 0 && (
              <Card className="p-10 text-center border-white/5 space-y-6">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
                  <Github size={32} className="text-white/40" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Connect Your GitHub</h2>
                  <p className="text-[var(--text-secondary)] mt-2">Link your account to start analyzing pull requests.</p>
                </div>
                {user?.githubId ? (
                  <div className="space-y-4">
                    <Badge variant="success" className="gap-1.5"><CheckCircle2 size={12} />GitHub Connected</Badge>
                    <Button onClick={() => setStep(1)} className="gap-2 w-full">Continue<ChevronRight size={18} /></Button>
                  </div>
                ) : (
                  <Button onClick={handleGithubConnect} className="gap-2 w-full"><Github size={18} />Connect GitHub</Button>
                )}
              </Card>
            )}

            {step === 1 && (
              <Card className="p-10 text-center border-white/5 space-y-6">
                <h2 className="text-2xl font-bold text-white">Select Repositories</h2>
                <p className="text-[var(--text-secondary)]">Choose which repos to enable for AI review.</p>
                <p className="text-sm text-[var(--text-muted)] italic">You can configure this later from the Repositories page.</p>
                <Button onClick={() => setStep(2)} className="gap-2 w-full">Skip for Now<ChevronRight size={18} /></Button>
              </Card>
            )}

            {step === 2 && (
              <Card className="p-10 text-center border-white/5 space-y-6">
                <h2 className="text-2xl font-bold text-white">Configure Preferences</h2>
                <p className="text-[var(--text-secondary)]">Set your review sensitivity and notification preferences.</p>
                <p className="text-sm text-[var(--text-muted)] italic">Default settings will be applied. Customize anytime in Settings.</p>
                <Button onClick={() => setStep(3)} className="gap-2 w-full">Continue<ChevronRight size={18} /></Button>
              </Card>
            )}

            {step === 3 && (
              <Card className="p-10 text-center border-white/5 space-y-6">
                <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
                <p className="text-[var(--text-secondary)]">Your workspace is ready. Start reviewing pull requests with AI.</p>
                <Button onClick={handleComplete} isLoading={loading} className="gap-2 w-full">
                  Launch Dashboard<ChevronRight size={18} />
                </Button>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {step > 0 && step < 3 && (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors mx-auto">
            <ArrowLeft size={14} />Go Back
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
