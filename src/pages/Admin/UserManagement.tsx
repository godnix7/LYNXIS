import { useState, useEffect } from 'react';
import { 
  Search, Filter, UserPlus, 
  Edit2, ShieldAlert
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:4003/api/admin/users', {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 max-w-xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                        <Input className="pl-10 h-12 bg-white/5 border-white/5" placeholder="Search real user base..." />
                    </div>
                    <Button variant="glass" className="gap-2 px-4 whitespace-nowrap"><Filter size={18} />Filters</Button>
                </div>
                <Button className="gap-2 px-6"><UserPlus size={20} />Invite Admin</Button>
            </div>

            <Card className="overflow-hidden border-white/5 bg-white/[0.02]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">User</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Roles</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-white/[0.02]">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white font-bold">{user.username[0]}</div>
                                        <div>
                                            <p className="font-bold text-white leading-tight">{user.username}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {user.roleAssignments?.map((ra: any) => (
                                            <Badge key={ra.role} variant="glass" className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-transparent">{ra.role}</Badge>
                                        ))}
                                        {user.roleAssignments?.length === 0 && <Badge variant="glass" className="opacity-30">USER</Badge>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="glass" className="h-8 w-8 p-0 border-transparent"><Edit2 size={14} /></Button>
                                        <Button variant="glass" className="h-8 w-8 p-0 border-transparent text-red-400"><ShieldAlert size={14} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default UserManagement;
