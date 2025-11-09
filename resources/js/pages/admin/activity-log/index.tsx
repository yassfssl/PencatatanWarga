import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { History } from 'lucide-react';
import { useMemo } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

type ActivityLog = {
    id: number;
    user_id: number | null;
    action: string;
    model_type: string;
    model_id: number | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    description: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: User | null;
};

type PageProps = {
    logs: {
        data: ActivityLog[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
    };
    users: User[];
    actions: string[];
    modelTypes: string[];
    filters: {
        user_id: string;
        action: string;
        model_type: string;
        date_from: string;
        date_to: string;
        search: string;
    };
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Log Aktivitas', href: '/activity-log' },
];

const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
        create: 'bg-green-500/20 text-green-200 border-green-500/40',
        update: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
        delete: 'bg-red-500/20 text-red-200 border-red-500/40',
        approve: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
        reject: 'bg-orange-500/20 text-orange-200 border-orange-500/40',
    };

    const color = colors[action] || 'bg-slate-500/20 text-slate-200 border-slate-500/40';

    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${color}`}>
            {action.toUpperCase()}
        </span>
    );
};

export default function ActivityLogIndex() {
    const { props } = usePage<PageProps>();
    const { logs, users, actions, modelTypes, filters } = props;

    const updateFilter = (key: keyof typeof filters, value: string) => {
        const query = new URLSearchParams();
        
        Object.entries(filters).forEach(([k, v]) => {
            if (k !== key && v && v !== '' && v !== 'all') {
                query.set(k, v);
            }
        });
        
        if (value !== '' && value !== 'all') {
            query.set(key, value);
        }
        
        router.get(`/activity-log?${query.toString()}`, {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Aktivitas" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <History className="h-6 w-6 text-slate-400" />
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Log Aktivitas</h1>
                        <p className="text-sm text-slate-400">Audit trail perubahan data - Siapa mengubah apa dan kapan</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Log Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Input
                                placeholder="Cari deskripsi atau user..."
                                defaultValue={filters.search}
                                onChange={(e) => updateFilter('search', e.target.value)}
                            />
                            <Select value={filters.user_id || 'all'} onValueChange={(v) => updateFilter('user_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter User" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua User</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filters.action || 'all'} onValueChange={(v) => updateFilter('action', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Aksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Aksi</SelectItem>
                                    {actions.map((action) => (
                                        <SelectItem key={action} value={action}>
                                            {action.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filters.model_type || 'all'} onValueChange={(v) => updateFilter('model_type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Model</SelectItem>
                                    {modelTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace('App\\Models\\', '')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                placeholder="Dari Tanggal"
                                defaultValue={filters.date_from}
                                onChange={(e) => updateFilter('date_from', e.target.value)}
                            />
                            <Input
                                type="date"
                                placeholder="Sampai Tanggal"
                                defaultValue={filters.date_to}
                                onChange={(e) => updateFilter('date_to', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Log Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {logs.data.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center text-slate-400">
                                Tidak ada log aktivitas ditemukan
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {logs.data.map((log) => (
                                    <div
                                        key={log.id}
                                        className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    {getActionBadge(log.action)}
                                                    <span className="text-xs text-slate-400">
                                                        {log.model_type.replace('App\\Models\\', '')}
                                                        {log.model_id && ` #${log.model_id}`}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-200">
                                                    {log.description || `${log.action} pada ${log.model_type.replace('App\\Models\\', '')}`}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                                    <span>
                                                        User: {log.user ? `${log.user.name} (${log.user.email})` : 'System'}
                                                    </span>
                                                    {log.ip_address && (
                                                        <span>IP: {log.ip_address}</span>
                                                    )}
                                                    <span>{formatDate(log.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {logs.links.length > 3 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                {logs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-md text-sm ${
                                            link.active
                                                ? 'bg-cyan-500 text-white'
                                                : link.url
                                                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                  : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


