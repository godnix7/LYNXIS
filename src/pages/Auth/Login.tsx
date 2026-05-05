import { API_BASE_URL } from '../../config/api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const Login = ({ onToggleSignUp }: { onToggleSignUp: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            window.location.reload();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-14 w-14 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] rotate-3 group hover:rotate-6 transition-transform">
                <Zap className="text-white" size={32} fill="white" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2 italic">ACCESS GRANTED</h1>
            <p className="text-[var(--text-muted)] text-sm font-medium tracking-wide">Enter your credentials to secure your workspace.</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                <Input 
                  className="pl-12 h-14 bg-white/5 border-white/5 focus:bg-white/10" 
                  placeholder="name@company.ai" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">Password</label>
                <button type="button" className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Recover</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                <Input 
                  className="pl-12 h-14 bg-white/5 border-white/5 focus:bg-white/10" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
                type="submit"
                className="w-full h-14 group relative overflow-hidden bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs mt-4"
                disabled={loading}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Verifying Access...' : 'Authenticate'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0a] px-4 text-[10px] font-bold uppercase tracking-widest text-white/20">or secure verify with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <Button 
                 variant="glass" 
                 className="h-14 border-white/5 hover:bg-white/5 gap-3"
                 onClick={() => login('github')}
            >
              <Github size={20} />
              <span className="font-bold uppercase tracking-widest text-[10px]">GitHub OIDC SSO</span>
            </Button>
          </div>

          <p className="mt-10 text-center text-xs font-medium text-[var(--text-muted)]">
            NEW RESEARCHER?{' '}
            <button 
                onClick={onToggleSignUp}
                className="text-white hover:text-[var(--accent-primary)] transition-colors font-bold uppercase tracking-wide border-b border-white/10 ml-1"
            >
                INITIALIZE ACCOUNT
            </button>
          </p>
        </Card>

        {/* Footer Meta */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">OIDC VERIFIED</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2 text-[var(--accent-primary)]">
            <Zap size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">ULTRA FAST</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
