import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Shield, GitPullRequest, Eye, Terminal, Sparkles, Code2, Lock, Cpu, Globe } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import NoiseOverlay from '../../components/visual/NoiseOverlay';
import { ParticleField } from '../../components/visual/ParticleField';

const features = [
  { 
    icon: Shield, 
    title: 'Security Analysis', 
    desc: 'AI detects vulnerabilities, injection risks, and auth flaws before they reach production.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  { 
    icon: Eye, 
    title: 'Code Quality', 
    desc: 'Deep pattern analysis enforces best practices, catches anti-patterns, and maintains consistency.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  { 
    icon: GitPullRequest, 
    title: 'PR Intelligence', 
    desc: 'Every pull request is analyzed in real-time with contextual, actionable feedback.',
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
  { 
    icon: Terminal, 
    title: 'CI/CD Ready', 
    desc: 'Integrates into your pipeline. Auto-review on push, block merges on critical findings.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10'
  },
];

const stats = [
  { val: '<2s', label: 'Review Time' },
  { val: '99.2%', label: 'Accuracy' },
  { val: '50+', label: 'Vulnerability Types' },
  { val: '24/7', label: 'Monitoring' },
];

export const LandingHome = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const PricingCard = ({ tier, price, desc, features, featured = false, onClick }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col h-full ${
        featured 
          ? "bg-white/[0.04] border-[var(--accent-primary)]/40 shadow-[0_0_50px_rgba(59,130,246,0.1)] scale-105 z-10" 
          : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <div className="mb-8 text-left">
        <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-black text-white">{price}</span>
          {price !== 'Custom' && <span className="text-[var(--text-muted)] text-sm">/mo</span>}
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed">{desc}</p>
      </div>
      <ul className="space-y-4 mb-10 flex-1 text-left">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-light">
            <CheckCircle size={16} className="text-[var(--accent-primary)]" />
            {f}
          </li>
        ))}
      </ul>
      <Button variant={featured ? 'primary' : 'secondary'} className="w-full font-bold" onClick={onClick}>
        {tier === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
      </Button>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-hidden selection:bg-[var(--accent-primary)]/30">
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
            Aegis uses advanced AI to analyze Pull Requests for security, performance, and best practices.
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
            <Button variant="ghost" size="lg" className="h-14 px-10 text-base font-bold text-white border border-white/5 hover:bg-white/5" onClick={onGetStarted}>
              View Live Demo
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
          {stats.map((s, i) => (
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

      {/* ── Trust Section ── */}
      <section className="relative z-10 py-24 border-b border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--text-muted)] mb-12 text-left">Trusted by Engineering Teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale contrast-125">
             <div className="text-2xl font-black tracking-tighter text-white">STRIPE</div>
             <div className="text-2xl font-black tracking-tighter text-white">VERCEL</div>
             <div className="text-2xl font-black tracking-tighter text-white">LINEAR</div>
             <div className="text-2xl font-black tracking-tighter text-white">GITHUB</div>
             <div className="text-2xl font-black tracking-tighter text-white">DATADOG</div>
          </div>
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
          <Badge variant="warm" className="tracking-[0.3em]">Capabilities</Badge>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight">
            Built for <span className="italic text-gradient-warm">serious</span> engineering.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto font-light leading-relaxed">
            We've trained our models on millions of production-grade PRs to identify issues that traditional linters miss.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[var(--accent-primary)]/20 transition-all duration-700 hover:bg-white/[0.04] overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10">
                <div className={`p-4 rounded-2xl ${f.bg} w-fit mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon size={28} className={f.color} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed font-light">{f.desc}</p>
                
                <ul className="mt-8 space-y-3 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                  <li className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <CheckCircle size={12} className="text-green-500" /> Automatic Detection
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <CheckCircle size={12} className="text-green-500" /> Actionable Fixes
                  </li>
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="relative z-10 py-32 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-16">
             <Badge variant="primary" className="mb-4 tracking-widest">Pricing</Badge>
             <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight">Simple, usage-based <span className="italic text-gradient">plans.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             <PricingCard 
               tier="Open Source" 
               price="$0" 
               desc="Perfect for hobbyists and public repos."
               features={['Unlimited public repos', 'Standard review speed', 'Community support']}
               onClick={onGetStarted}
             />
             <PricingCard 
               tier="Pro" 
               price="$29" 
               desc="For professional engineers and teams."
               features={['Unlimited private repos', 'Priority review speed', 'Advanced security scans', 'Email support']}
               featured
               onClick={onGetStarted}
             />
             <PricingCard 
               tier="Enterprise" 
               price="Custom" 
               desc="Bespoke solutions for large organizations."
               features={['SAML SSO', 'Custom AI training', 'Dedicated account manager', '99.9% uptime SLA']}
               onClick={onGetStarted}
             />
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 py-48 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight leading-[0.95]"
          >
            Elevate your<br />
            <span className="italic text-gradient">development workflow.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <Button size="lg" className="h-20 px-16 text-xl font-bold gap-3 shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] transition-all" onClick={onGetStarted}>
              Get Started Now
              <ChevronRight size={26} />
            </Button>
            <p className="text-base text-[var(--text-muted)] font-light">Join over 10,000+ engineers worldwide.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5 pt-20 pb-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 mb-20 text-left">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--accent-warm)] to-[var(--accent-warm)]/60 shadow-[0_0_20px_var(--accent-warm)]/30" />
              <span className="text-2xl font-bold tracking-[0.1em] text-white uppercase" style={{ fontFamily: 'var(--font-heading)' }}>Aegis</span>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xs leading-relaxed font-light">
              Providing next-generation code intelligence for modern engineering teams. Built with precision and powered by Althea AI.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Security</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Quality</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">CI/CD</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Pricing</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">About</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Blog</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Careers</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Privacy</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Terms</button></li>
              <li><button onClick={onGetStarted} className="hover:text-white transition-colors text-left">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-bold">
            &copy; 2026 Aegis. All rights reserved.
          </p>
          <div className="flex gap-6 text-[var(--text-muted)]">
             <Globe size={18} className="hover:text-white cursor-pointer transition-colors" />
             <Code2 size={18} className="hover:text-white cursor-pointer transition-colors" />
             <Cpu size={18} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const CheckCircle = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
