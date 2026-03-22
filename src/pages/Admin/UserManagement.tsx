import { useState, useEffect } from 'react';
import { Users, Search, Filter, Shield, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:4003/api/admin/users', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
          <p className="text-[var(--text-muted)]">Manage across-tenant user access and global permissions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="gap-2 h-11 border-white/5 bg-white/5">
            <Filter size={18} />
            Filters
          </Button>
          <Button className="gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield size={18} />
            Global Roles
          </Button>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
        <Input className="pl-12 bg-white/[0.02] border-white/5 h-12" placeholder="Search by name, email, or GitHub ID..." />
      </div>

      <Card className="p-0 overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Roles</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Account ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-[var(--text-muted)] italic">Loading user directory...</td></tr>
              ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-[var(--text-muted)] italic">No users found in global directory.</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                          <img src={u.avatarUrl} className="h-10 w-10 rounded-full border border-white/10" alt="" />
                      ) : (
                          <div className="h-10 w-10 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30" />
                      )}
                      <div>
                        <p className="font-bold text-white">{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username}</p>
                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {(u.roleAssignments || []).map((ra: any) => (
                          <Badge key={ra.role} variant="primary" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">{ra.role}</Badge>
                      ))}
                      {(!u.roleAssignments || u.roleAssignments.length === 0) && <span className="text-[var(--text-muted)] italic text-xs">Standard User</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {u.onboardingCompleted ? (
                          <><CheckCircle2 size={14} className="text-green-400" /><span className="text-xs text-green-400">Active</span></>
                      ) : (
                          <><XCircle size={14} className="text-red-400" /><span className="text-xs text-red-400">Incomplete</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-[var(--text-muted)]">{u.id}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
