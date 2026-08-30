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

import { LandingHome } from './pages/Landing/LandingHome';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState('overview');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      if (path === '') {
        setCurrentPage(user ? 'dashboard' : 'landing');
      } else if (path.startsWith('admin')) {
        setCurrentPage('admin');
        const tab = path.split('/')[1];
        if (tab) setAdminTab(tab);
      } else {
        setCurrentPage(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check

    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const navigate = (page: string) => {
    const cleanPage = page.split('/')[0];
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page === 'dashboard' ? '' : page}`);
  };

  const isComingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  if (isComingSoonMode) return <div className="bg-[var(--bg-primary)] min-h-screen"><ComingSoon /></div>;

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <NoiseOverlay />
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent shadow-[0_0_20px_var(--accent-primary)]" />
    </div>
  );

  if (!user) {
    if (currentPage === 'login') return <Login onToggleSignUp={() => navigate('signup')} />;
    if (currentPage === 'signup') return <SignUp onToggleMode={() => navigate('login')} />;
    return <LandingHome onGetStarted={() => navigate('login')} />;
  }

  if (user && !user.onboardingCompleted) return <OnboardingWizard />;

  const isAdmin = user?.roleAssignments?.some((ra: any) => ra.role === 'SUPER_ADMIN') || user?.roles?.includes('SUPER_ADMIN');

  if (currentPage.startsWith('admin')) {
    if (!isAdmin) { navigate('dashboard'); return null; }
    return (
      <AdminShell activeTab={adminTab} onNavigate={(tab) => navigate(`admin/${tab}`)}>
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

  const validPages = ['dashboard', 'repos', 'reviews', 'settings', 'billing', 'coming-soon'];
  const displayPage = validPages.includes(currentPage) ? currentPage : 'dashboard';

  return (
    <Shell onNavigate={navigate} activeTab={displayPage}>
      {displayPage === 'dashboard' && <DashboardHome onNavigate={navigate} />}
      {displayPage === 'repos' && <RepoList onSelectRepo={(id: string) => { setSelectedRepoId(id); navigate('reviews'); }} />}
      {displayPage === 'reviews' && <PRReviewViewer repoId={selectedRepoId || undefined} />}
      {displayPage === 'settings' && <SettingsHome />}
      {displayPage === 'billing' && <BillingHome />}
      {displayPage === 'coming-soon' && <ComingSoon />}
    </Shell>
  );
}

export default App;
