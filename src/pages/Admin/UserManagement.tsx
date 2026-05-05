import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Shield, MoreVertical, CheckCircle2, XCircle, UserPlus, Mail } from 'lucide-react';
import { Card, Badge } from '../../components/ui';

interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  roleAssignments: { role: string }[];
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:4003/api/admin/users', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-warm)] mb-2">
            <Users size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Personnel Matrix</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-warm)] tracking-tight italic">
            User <span className="text-[var(--text-muted)]">Governance.</span>
          </h1>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-warm)] text-[var(--surface)] text-sm font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all">
          <UserPlus size={16} /> Provision Access
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-warm)] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search verified entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-[var(--text-warm)] focus:outline-none focus:border-[var(--accent-warm)]/50 focus:ring-1 focus:ring-[var(--accent-warm)]/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[var(--text-muted)] hover:text-[var(--text-warm)] hover:bg-white/5 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Filter size={14} /> Filters
           </button>
           <button className="px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[var(--text-muted)] hover:text-[var(--text-warm)] hover:bg-white/5 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Shield size={14} /> Global Roles
           </button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
                <th className="px-8 py-5">Verified User</th>
                <th className="px-8 py-5">Intelligence Role</th>
                <th className="px-8 py-5">Node Status</th>
                <th className="px-8 py-5">Account ID</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-6 h-20 bg-white/[0.01] border-b border-white/5" />
                    </tr>
                  ))
                ) : (
                  filteredUsers.map((u, i) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                             {u.avatarUrl ? (
                               <img src={u.avatarUrl} alt="" className="h-full w-full object-cover" />
                             ) : (
                               <div className="h-full w-full bg-[var(--accent-warm)]/10 flex items-center justify-center text-[var(--accent-warm)] text-xs font-bold">
                                 {u.username[0]}
                               </div>
                             )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text-warm)]">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username}</p>
                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                               <Mail size={10} />
                               <span className="text-[10px]">{u.email || 'No email associated'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-2">
                          {(u.roleAssignments || []).map((ra: any) => (
                            <Badge key={ra.role} variant="primary" className="bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] border-[var(--accent-warm)]/20">
                              {ra.role}
                            </Badge>
                          ))}
                          {(!u.roleAssignments || u.roleAssignments.length === 0) && (
                            <span className="text-[10px] text-[var(--text-muted)] italic font-medium">Standard Node</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {u.onboardingCompleted ? (
                          <div className="flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                             <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Incomplete</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 font-mono text-[10px] text-[var(--text-muted)]/50">{u.id}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--accent-warm)] transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
