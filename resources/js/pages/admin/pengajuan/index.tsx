import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

type Pengajuan = {
    id: number;
    warga: {
        id: number;
        nik: string;
        nama_lengkap: string;
    };
    user: {
        id: number;
        name: string;
    };
    data_perubahan: Record<string, string>;
    alasan?: string;
    status: 'pending' | 'approved' | 'rejected';
    catatan_admin?: string;
    admin?: {
        id: number;
        name: string;
    } | null;
    reviewed_at?: string;
    created_at: string;
};

type PageProps = {
    pengajuan: {
        data: Pengajuan[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: {
        pending: number;
        approved: number;
        rejected: number;
    };
    filters: {
        status: string;
        search: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengajuan', href: '/pengajuan' }];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    <Clock className="mr-1 h-3 w-3" />
                    Menunggu
                </Badge>
            );
        case 'approved':
            return (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Disetujui
                </Badge>
            );
        case 'rejected':
            return (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                    <XCircle className="mr-1 h-3 w-3" />
                    Ditolak
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function PengajuanIndex() {
    const { props } = usePage<PageProps>();
    const { pengajuan, stats, filters } = props;

    const updateFilter = (key: 'status' | 'search', value: string) => {
        const query = new URLSearchParams();
        if (filters.status && key !== 'status') query.set('status', filters.status);
        if (filters.search && key !== 'search') query.set('search', filters.search);
        if (value !== '' && value !== 'all') query.set(key, value);
        router.get(`/pengajuan?${query.toString()}`, {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Perubahan Data" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-yellow-500/15 via-slate-900 to-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Menunggu Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-white">{stats.pending}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Disetujui</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">{stats.approved}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Ditolak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">{stats.rejected}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl">Daftar Pengajuan</CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">Tinjau dan kelola pengajuan perubahan data dari warga</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <Input
                                placeholder="Cari NIK / Nama"
                                defaultValue={filters.search}
                                onChange={(e) => updateFilter('search', e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Select value={filters.status || 'all'} onValueChange={(v) => updateFilter('status', v)}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {pengajuan.data.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Tidak ada pengajuan</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {pengajuan.data.map((item) => (
                                        <Card key={item.id} className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-semibold">{item.warga.nama_lengkap}</h3>
                                                        {getStatusBadge(item.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        NIK: {item.warga.nik} | Diajukan oleh: {item.user.name}
                                                    </p>
                                                    <div className="text-sm">
                                                        <p className="font-medium mb-1">Perubahan yang diajukan:</p>
                                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                            {Object.entries(item.data_perubahan).map(([key, value]) => (
                                                                <li key={key}>
                                                                    <span className="capitalize">{key.replace('_', ' ')}</span>:{' '}
                                                                    <strong>{value}</strong>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    {item.alasan && (
                                                        <p className="text-sm text-muted-foreground">
                                                            <strong>Alasan:</strong> {item.alasan}
                                                        </p>
                                                    )}
                                                    {item.status !== 'pending' && item.catatan_admin && (
                                                        <div className="mt-2 p-3 bg-muted rounded-lg">
                                                            <p className="text-sm">
                                                                <strong>Catatan Admin:</strong> {item.catatan_admin}
                                                            </p>
                                                            {item.admin && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    Ditinjau oleh: {item.admin.name} pada{' '}
                                                                    {new Date(item.reviewed_at!).toLocaleString('id-ID')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Diajukan pada: {new Date(item.created_at).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link href={`/pengajuan/${item.id}`}>
                                                        <Button size="sm" variant="outline">Detail</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {pengajuan.links.map((link, index) => (
                                        <Link key={index} href={link.url || '#'} preserveScroll preserveState>
                                            <Button
                                                variant={link.active ? 'default' : 'outline'}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}






