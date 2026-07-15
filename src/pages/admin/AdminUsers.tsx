import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Shield, ShieldCheck } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/admin/DataTable';

interface UserRow {
  id: string; name: string; email: string; role: string;
  twoFactor: boolean; lastLogin: string; status: string;
}

const roleColors: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'accent'> = {
  admin: 'accent', store_manager: 'primary', content_editor: 'success', marketing: 'warning', support: 'primary', finance: 'primary',
};

export function AdminUsers() {
  const users = useQuery(api.users.list, {});

  const rows: UserRow[] = useMemo(() => {
    if (!users) return [];
    return users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      twoFactor: u.twoFactorEnabled,
      lastLogin: 'N/A',
      status: 'active',
    }));
  }, [users]);

  if (users === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const columns: Column<UserRow>[] = [
    {
      key: 'name', label: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-sm font-bold">
            {u.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{u.name}</p>
            <p className="text-xs text-text-muted">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role',
      render: (u) => <Badge variant={roleColors[u.role] || 'default'} size="sm" className="capitalize">{u.role.replace(/_/g, ' ')}</Badge>,
    },
    {
      key: 'twoFactor', label: '2FA', className: 'hidden sm:table-cell',
      render: (u) => u.twoFactor ? <ShieldCheck className="w-4 h-4 text-success" /> : <Shield className="w-4 h-4 text-text-muted" />,
    },
    { key: 'lastLogin', label: 'Last Login', className: 'hidden md:table-cell' },
    { key: 'status', label: 'Status', render: () => <Badge variant="success">Active</Badge> },
    {
      key: 'actions', label: '',
      render: () => (
        <div className="flex gap-1">
          <button className="p-1.5 rounded hover:bg-section"><Edit className="w-4 h-4 text-text-muted" /></button>
          <button className="p-1.5 rounded hover:bg-section"><Trash2 className="w-4 h-4 text-text-muted" /></button>
        </div>
      ),
    },
  ];

  const roles = ['admin', 'store_manager', 'content_editor', 'marketing', 'support', 'finance'];
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Users & Roles</h1>
          <p className="text-sm text-text-muted">Manage team members and permissions</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Invite User</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Users', value: users.length.toString(), color: 'text-success' },
          { label: 'Roles', value: roles.length.toString(), color: 'text-primary' },
          { label: 'Admin Users', value: adminCount.toString(), color: 'text-accent' },
          { label: 'Pending Invites', value: '0', color: 'text-text-muted' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-white">
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className={`font-heading text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={rows} keyExtractor={(u) => u.id} searchPlaceholder="Search users..." />
    </div>
  );
}
