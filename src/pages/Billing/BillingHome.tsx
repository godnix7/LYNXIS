
import { motion } from 'framer-motion';
import { CreditCard, Check, Crown, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

const plans = [
  {
    name: 'Free', price: '$0', period: '/mo', features: ['5 repos', '100 reviews/mo', 'Basic analysis', 'Community support'],
    current: true, color: 'var(--text-secondary)',
  },
  {
    name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited repos', 'Unlimited reviews', 'Security scanning', 'Priority support', 'Custom rules'],
    popular: true, color: 'var(--accent-primary)',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'SSO/SAML', 'Audit logs', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
    color: 'var(--accent-warm)',
  }
];

const BillingHome = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Billing & Plans</h2>
        <p className="text-[var(--text-secondary)]">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`p-8 border-white/5 bg-white/[0.02] relative overflow-hidden ${plan.popular ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/[0.03]' : ''}`}>
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <Badge variant="primary" className="gap-1"><Crown size={10} />Popular</Badge>
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} style={{ color: plan.color }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  variant={plan.current ? 'ghost' : plan.popular ? 'primary' : 'glass'}
                  className="w-full gap-2"
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                  {!plan.current && <ArrowRight size={16} />}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-white/5 bg-white/[0.01] space-y-6">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-[var(--accent-primary)]" />
          <h3 className="text-lg font-bold text-white">Payment Method</h3>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5"><CreditCard size={18} className="text-white/40" /></div>
            <div>
              <p className="text-sm font-bold text-white">No payment method on file</p>
              <p className="text-xs text-[var(--text-muted)]">Add a card to upgrade your plan</p>
            </div>
          </div>
          <Button variant="glass" size="sm">Add Card</Button>
        </div>
      </Card>
    </div>
  );
};

export default BillingHome;
