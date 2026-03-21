import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
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
import AdminOverview from './pages/Admin/AdminOverview';
import UserManagement from './pages/Admin/UserManagement';
import AuditLogs from './pages/Admin/AuditLogs';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState('overview');

  // Simple URL Sync
  useEffect(() => {
    const path = window.location.pathname.substring(1);
    if (path.startsWith('auth-callback')) {
        // Successful login redirect, clean the URL and go to dashboard
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

  // Global Coming Soon Mode Override
  const isComingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === 'true';

  if (isComingSoonMode) {
    return (
      <div className="bg-[var(--bg-primary)] min-h-screen">
        <ComingSoon />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent shadow-[0_0_20px_var(--accent-primary)]" />
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'login') return <Login onToggleSignUp={() => setCurrentPage('signup')} />;
    if (currentPage === 'signup') return <SignUp onToggleMode={() => setCurrentPage('login')} />;
    return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
  }

  if (!user.onboardingCompleted) {
    return <OnboardingWizard />;
  }

  // Admin Route Handling - Strict RBAC
  const isAdmin = user?.roleAssignments?.some((ra: any) => ra.role === 'SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');

  if (currentPage.startsWith('admin')) {
    if (!isAdmin) {
        // Fallback if trying to access admin without the role
        setCurrentPage('dashboard');
        return <DashboardHome onNavigate={setCurrentPage} />;
    }
    return (
      <AdminShell activeTab={adminTab} onNavigate={setAdminTab}>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'users' && <UserManagement />}
        {adminTab === 'audit' && <AuditLogs />}
        {['repos', 'reviews', 'flags', 'security', 'health'].includes(adminTab) && <ComingSoon />}
      </AdminShell>
    );
  }

  return (
    <Shell onNavigate={setCurrentPage} activeTab={currentPage}>
      {currentPage === 'dashboard' && <DashboardHome onNavigate={(tab) => setCurrentPage(tab)} />}
      {currentPage === 'repos' && <RepoList onSelectRepo={(id) => { setSelectedRepoId(id); setCurrentPage('reviews'); }} />}
      {currentPage === 'reviews' && <PRReviewViewer repoId={selectedRepoId || undefined} />}
      {currentPage === 'settings' && <SettingsHome />}
      {currentPage === 'billing' && <BillingHome />}
      {currentPage === 'coming-soon' && <ComingSoon />}
    </Shell>
  );
}

const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-center p-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 max-w-4xl space-y-8"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-4 py-1 text-sm font-medium text-[var(--accent-primary)] shadow-inner">
        <Zap size={14} />
        <span>Beta Access Now Open</span>
      </div>
      <h1 className="text-6xl font-extrabold tracking-tighter text-white md:text-8xl">
        Automate your <br />
        <span className="text-gradient">Code Review.</span>
      </h1>
      <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)] leading-relaxed">
        Lynxis uses advanced AI to analyze Pull Requests for security, performance, and best practices. 
        Get high-quality reviews in seconds, not hours.
      </p>
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2" onClick={onGetStarted}>
          Get Started For Free
          <ChevronRight size={20} />
        </Button>
        <Button variant="glass" size="lg" className="h-14 px-8 text-lg font-bold border-white/10 hover:bg-white/5">
          View Demo
        </Button>
      </div>
    </motion.div>
  </div>
);

export default App;
