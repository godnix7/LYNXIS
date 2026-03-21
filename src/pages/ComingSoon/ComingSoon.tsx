import { motion } from 'framer-motion';
import { Rocket, Mail, ArrowRight, Stars } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';

const ComingSoon = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center space-y-12 py-20 px-6 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-[var(--accent-primary)]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-[var(--accent-secondary)]/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6 relative z-10"
      >
        <Badge variant="primary" className="px-4 py-1.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/20 animate-bounce">
          <Stars size={14} className="mr-2 inline" />
          Next-Gen AI Analysis
        </Badge>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white">
          Something <span className="text-gradient">Legendary</span> <br />
          is Coming.
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-[var(--text-secondary)] leading-relaxed">
          We're engineering the next evolution of pull request intelligence. 
          Advanced heuristics, deep logic analysis, and a professional glassmorphism experience.
        </p>
      </motion.div>

      {/* Countdown/Stats Stubs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl animate-reveal delay-1">
        <StatBlock label="Days" value="08" />
        <StatBlock label="Hours" value="14" />
        <StatBlock label="Minutes" value="32" />
        <StatBlock label="Seconds" value="45" />
      </div>

      {/* Subscription Card */}
      <Card className="w-full max-w-2xl p-10 space-y-8 bg-white/[0.02] border-white/5 animate-reveal delay-2">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-white">Get Early Access</h3>
          <p className="text-[var(--text-muted)]">Be the first to know when we launch the v2 intelligence engine.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
            <Input 
                className="pl-12 bg-white/[0.03] border-white/5 h-14" 
                placeholder="Enter your work email..." 
            />
          </div>
          <Button size="lg" className="h-14 px-10 gap-2">
            Notify Me
            <ArrowRight size={20} />
          </Button>
        </div>
        
        <p className="text-center text-xs text-[var(--text-muted)]">
          No spam, ever. Only major updates and early access invites.
        </p>
      </Card>

      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pt-12 text-[var(--text-muted)] flex flex-col items-center gap-4"
      >
        <Rocket className="text-[var(--accent-primary)] opacity-50" size={32} />
        <span className="text-sm font-medium tracking-widest uppercase">Launch Status: Orbiting</span>
      </motion.div>
    </div>
  );
};

const StatBlock = ({ label, value }: { label: string; value: string }) => (
  <Card className="flex flex-col items-center justify-center p-6 bg-white/[0.01] border-white/5 hover:border-[var(--accent-primary)]/20 transition-all group">
    <span className="text-4xl font-black text-white group-hover:text-[var(--accent-primary)] transition-colors">{value}</span>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mt-2">{label}</span>
  </Card>
);

export default ComingSoon;
