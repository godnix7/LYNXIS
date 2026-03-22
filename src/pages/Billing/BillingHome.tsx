import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, CreditCard, ChevronRight } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    description: 'Perfect for side projects and small teams.',
    features: ['Up to 3 Repositories', 'Basic AI Review', 'Standard Support', 'Public Repos Only'],
    icon: <Zap size={24} />,
    color: '#888888',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$29',
    description: 'Advanced intelligence for scaling teams.',
    features: ['Unlimited Repositories', 'Advanced AI Findings', 'Priority Support', 'Private Repos', 'Custom Rules'],
    icon: <Crown size={24} />,
    color: 'var(--accent-primary)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Bank-grade security and custom governance.',
    features: ['SAML/SSO', 'Dedicated Support', 'On-premise AI', 'Audit Logs', 'Advanced Governance'],
    icon: <Shield size={24} />,
    color: 'var(--accent-secondary)',
  },
];

const BillingHome = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  return (
    <div className="space-y-16 animate-reveal selection:bg-[var(--accent-primary)] selection:text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tighter text-white md:text-7xl">
          Simple, <span className="text-gradient">Transparent</span> Pricing.
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-[var(--text-secondary)] leading-relaxed">
          Choose the plan that fits your team's size and security requirements. 
          Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
          <Card className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between bg-white/[0.01] border-white/5 py-8 px-10">
            <div className="flex items-center gap-6">
              <div className="rounded-2xl bg-white/5 p-4 text-[var(--text-muted)] shadow-inner">
                <CreditCard size={36} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Payment Method</h3>
                <p className="text-[var(--text-secondary)] font-medium italic">No payment method on file.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" size="sm" className="px-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">Add Method</Button>
            </div>
          </Card>
 
          <Card className="bg-white/[0.01] border-white/5 py-8 px-10 group transition-colors">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Recent Invoices</h3>
                    <p className="text-sm text-[var(--text-muted)] italic">No billing history available yet.</p>
                </div>
                <div className="h-10 w-10 animated-pulse rounded-full border border-white/5 flex items-center justify-center text-[var(--text-muted)]">
                </div>
            </div>
          </Card>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all hover:opacity-100 py-4">
        {['GitLab', 'Postman', 'Vercel', 'Stripe', 'Framer'].map(logo => (
            <span key={logo} className="text-xl font-bold tracking-tighter text-white">{logo}</span>
        ))}
      </div>
    </div>
  );
};

const PlanCard = ({ plan, isSelected, onSelect, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="relative group"
  >
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-[var(--grad-primary)] px-5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
        Most Popular
      </div>
    )}
    <Card 
      className={`h-full border transition-all duration-500 bg-white/[0.01] overflow-hidden ${
        isSelected ? 'border-[var(--accent-primary)]/40 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-white/5 group-hover:border-white/10'
      }`}
      onClick={onSelect}
    >
      {isSelected && (
          <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
            <div className="h-24 w-24 rounded-full bg-[var(--accent-primary)]" />
          </div>
      )}
      
      <div className="relative space-y-8">
        <div className="flex items-center justify-between">
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner border border-white/5" 
            style={{ backgroundColor: `${plan.color}10`, color: plan.color }}
          >
            {plan.icon}
          </div>
          {isSelected && <Badge variant="primary" className="bg-[var(--accent-primary)]/10">Active Selection</Badge>}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{plan.name}</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">{plan.description}</p>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-5xl font-extrabold text-white tracking-tighter">{plan.price}</span>
          {plan.price !== 'Custom' && <span className="text-lg font-bold text-[var(--text-muted)]">/mo</span>}
        </div>

        <Button 
          variant={isSelected ? 'primary' : 'glass'} 
          className={`w-full gap-3 py-4 text-sm font-bold transition-all shadow-none ${
              !isSelected ? 'bg-white/5 border-white/5 hover:bg-white/10' : ''
          }`}
          onClick={onSelect}
        >
          {plan.id === 'free' ? 'Current Plan' : 'Get Started'}
          <ChevronRight size={18} />
        </Button>

        <div className="space-y-4 pt-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--text-muted)]">Core Capabilities</p>
          <div className="space-y-3">
            {plan.features.map((feature: string) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium group">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-[var(--success)]/20`}>
                    <Check size={12} className="text-[var(--success)]" />
                </div>
                {feature}
                </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
);

export default BillingHome;
