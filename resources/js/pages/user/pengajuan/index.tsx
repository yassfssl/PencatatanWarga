import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { FileEdit, Plus } from 'lucide-react';

type Pengajuan = {
    id: number;
    warga: {
        id: number;
        nik: string;
        nama_lengkap: string;
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
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengajuan', href: '/pengajuan' }];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Menunggu</Badge>;
        case 'approved':
            return <Badge variant="outline" className="bg-green-500/10 text-green-600">Disetujui</Badge>;
        case 'rejected':
            return <Badge variant="outline" className="bg-red-500/10 text-red-600">Ditolak</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function PengajuanIndex() {
    const { props } = usePage<PageProps>();
    const { pengajuan } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan Perubahan Data" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-xl md:text-2xl">Pengajuan Perubahan Data</CardTitle>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">
                                Lihat status pengajuan perubahan data Anda
                            </p>
                        </div>
                        <Link href="/pengajuan/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Pengajuan
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pengajuan.data.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileEdit className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>Belum ada pengajuan perubahan data</p>
                                <Link href="/pengajuan/create" className="mt-4 inline-block">
                                    <Button variant="outline">Buat Pengajuan Pertama</Button>
                                </Link>
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
                                                        NIK: {item.warga.nik}
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
                                                                    Ditinjau oleh: {item.admin.name}
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




