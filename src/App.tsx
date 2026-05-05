import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, GitPullRequest, Eye, Terminal } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Button } from './components/ui';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import OnboardingWizard from './pages/Onboarding/OnboardingWizard';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import { Shell } from './components/layout';
import { AdminShell } from './components/layout/AdminShell';
import DashboardHome from './pages/Dashboard/DashboardHome';
import RepoList from './pages/Repos/RepoList';
import PRReviewViewer from './pages/Reviews/PRReviewViewer';
import SettingsHome from './pages/Settings/SettingsHome';
import BillingHome from './pages/Billing/BillingHome';
import { AdminOverview, AdminRepos, AdminReviews, AdminFlags, AdminSecurity, AdminHealth, UserManagement, AuditLogs } from './pages/Admin';
import NoiseOverlay from './components/visual/NoiseOverlay';
import { ParticleField } from './components/visual/ParticleField';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState('overview');

  useEffect(() => {
    const path = window.location.pathname.substring(1);
    if (path.startsWith('auth-callback')) {
      window.history.replaceState({}, '', '/');
      setCurrentPage('dashboard');
    } else if (path.startsWith('admin')) {
      setCurrentPage('admin');
      const tab = path.split('/')[1];
      if (tab) setAdminTab(tab);
    } else if (path) {
      setCurrentPage(path);
    }
  }, []);

  const isComingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  if (isComingSoonMode) return <div className="bg-[var(--bg-primary)] min-h-screen"><ComingSoon /></div>;

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <NoiseOverlay />
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent shadow-[0_0_20px_var(--accent-primary)]" />
    </div>
  );

  if (!user) {
    if (currentPage === 'login') return <Login onToggleSignUp={() => setCurrentPage('signup')} />;
    if (currentPage === 'signup') return <SignUp onToggleMode={() => setCurrentPage('login')} />;
    return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
  }

  if (user && !user.onboardingCompleted) return <OnboardingWizard />;

  const isAdmin = user?.roleAssignments?.some((ra: any) => ra.role === 'SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');

  if (currentPage.startsWith('admin')) {
    if (!isAdmin) { setCurrentPage('dashboard'); return <DashboardHome onNavigate={setCurrentPage} />; }
    return (
      <AdminShell activeTab={adminTab} onNavigate={setAdminTab}>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'users' && <UserManagement />}
        {adminTab === 'audit' && <AdminSecurity />}
        {adminTab === 'repos' && <AdminRepos />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'flags' && <AdminFlags />}
        {adminTab === 'security' && <AdminSecurity />}
        {adminTab === 'health' && <AdminHealth />}
      </AdminShell>
    );
  }

  return (
    <Shell onNavigate={setCurrentPage} activeTab={currentPage}>
      {currentPage === 'dashboard' && <DashboardHome onNavigate={(tab: string) => setCurrentPage(tab)} />}
      {currentPage === 'repos' && <RepoList onSelectRepo={(id: string) => { setSelectedRepoId(id); setCurrentPage('reviews'); }} />}
      {currentPage === 'reviews' && <PRReviewViewer repoId={selectedRepoId || undefined} />}
      {currentPage === 'settings' && <SettingsHome />}
      {currentPage === 'billing' && <BillingHome />}
      {currentPage === 'coming-soon' && <ComingSoon />}
    </Shell>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */

const features = [
  { icon: Shield, title: 'Security Analysis', desc: 'AI detects vulnerabilities, injection risks, and auth flaws before they reach production.' },
  { icon: Eye, title: 'Code Quality', desc: 'Deep pattern analysis enforces best practices, catches anti-patterns, and maintains consistency.' },
  { icon: GitPullRequest, title: 'PR Intelligence', desc: 'Every pull request is analyzed in real-time with contextual, actionable feedback.' },
  { icon: Terminal, title: 'CI/CD Ready', desc: 'Integrates into your pipeline. Auto-review on push, block merges on critical findings.' },
];

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="relative min-h-screen bg-[#020202] overflow-hidden">
    <NoiseOverlay />
    <div className="mesh-glow" />

    {/* ── Hero Section ── */}
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6">
      <ParticleField className="opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020202]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 max-w-5xl space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-5 py-2 text-sm font-medium text-[var(--accent-warm)] shadow-inner backdrop-blur-sm"
        >
          <Zap size={14} className="animate-pulse" />
          <span className="tracking-wide">AI-Powered Code Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-[0.9]"
        >
          Automate your{' '}
          <span className="text-gradient-warm italic">Code Review.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed font-light"
        >
          Lynxis uses advanced AI to analyze Pull Requests for security, performance, and best practices.
          Get high-quality reviews in seconds, not hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button size="lg" className="h-14 px-10 text-base font-bold gap-2 animate-pulse-glow" onClick={onGetStarted}>
            Start Free Trial
            <ChevronRight size={20} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 animate-float"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
          />
        </div>
      </motion.div>
    </section>

    {/* ── Stats Strip ── */}
    <section className="relative z-10 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {[
          { val: '<2s', label: 'Review Time' },
          { val: '99.2%', label: 'Accuracy' },
          { val: '50+', label: 'Vulnerability Types' },
          { val: '24/7', label: 'Monitoring' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="py-10 text-center"
          >
            <p className="text-3xl md:text-4xl font-black text-white tracking-tight">{s.val}</p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── Features Grid ── */}
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20 space-y-4"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-warm)]">Capabilities</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight">
          Built for <span className="italic text-gradient-warm">serious</span> engineering.
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[var(--accent-primary)]/20 transition-all duration-500 hover:bg-white/[0.04] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent-primary)]/5 blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="p-3 rounded-xl bg-white/5 w-fit mb-6 group-hover:bg-[var(--accent-primary)]/10 transition-colors duration-500">
                <f.icon size={24} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── CTA Section ── */}
    <section className="relative z-10 py-32 text-center px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-7xl font-bold text-white tracking-tight leading-[0.95]"
        >
          Your code deserves<br />
          <span className="italic text-gradient">intelligent review.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button size="lg" className="h-16 px-12 text-lg font-bold gap-3" onClick={onGetStarted}>
            Get Started — It's Free
            <ChevronRight size={22} />
          </Button>
        </motion.div>
        <p className="text-sm text-[var(--text-muted)]">No credit card required. Setup in under 2 minutes.</p>
      </div>
    </section>

    {/* ── Footer ── */}
    <footer className="relative z-10 border-t border-white/5 py-8 text-center">
      <p className="text-xs text-[var(--text-muted)] tracking-widest uppercase">
        &copy; 2026 Lynxis. AI-Powered Code Intelligence.
      </p>
    </footer>
  </div>
);

export default App;
