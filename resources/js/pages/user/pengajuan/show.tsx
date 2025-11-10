import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

type Pengajuan = {
    id: number;
    warga: {
        id: number;
        nik: string;
        nama_lengkap: string;
        alamat: string;
        rt: string;
        rw: string;
        kelurahan: string;
        kecamatan: string;
        kota: string;
        provinsi: string;
        kode_pos?: string;
        no_telepon?: string;
        pekerjaan?: string;
        pendidikan?: string;
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
    pengajuan: Pengajuan;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengajuan', href: '/pengajuan' },
    { title: 'Detail', href: '#' },
];

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

export default function PengajuanShow() {
    const { props } = usePage<PageProps>();
    const { pengajuan } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pengajuan" />
            <div className="space-y-6 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Detail Pengajuan</CardTitle>
                            <div className="mt-2">{getStatusBadge(pengajuan.status)}</div>
                        </div>
                        <Link href="/pengajuan">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold mb-2">Informasi Pengajuan</h3>
                                <p className="text-sm">
                                    <strong>Tanggal Pengajuan:</strong>{' '}
                                    {new Date(pengajuan.created_at).toLocaleString('id-ID')}
                                </p>
                                {pengajuan.reviewed_at && (
                                    <p className="text-sm">
                                        <strong>Tanggal Review:</strong>{' '}
                                        {new Date(pengajuan.reviewed_at).toLocaleString('id-ID')}
                                    </p>
                                )}
                                {pengajuan.admin && (
                                    <p className="text-sm">
                                        <strong>Ditinjau oleh:</strong> {pengajuan.admin.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Perubahan yang Diajukan</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {Object.entries(pengajuan.data_perubahan).map(([key, newValue]) => {
                                    const currentValue = pengajuan.warga[key as keyof typeof pengajuan.warga] || '-';
                                    return (
                                        <div key={key} className="p-3 border rounded-lg">
                                            <p className="text-sm font-medium capitalize mb-1">{key.replace('_', ' ')}</p>
                                            <p className="text-sm text-muted-foreground line-through">
                                                {currentValue}
                                            </p>
                                            <p className="text-sm font-semibold text-green-600">→ {newValue}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {pengajuan.alasan && (
                            <div>
                                <h3 className="font-semibold mb-2">Alasan Perubahan</h3>
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                    {pengajuan.alasan}
                                </p>
                            </div>
                        )}

                        {pengajuan.status !== 'pending' && pengajuan.catatan_admin && (
                            <div>
                                <h3 className="font-semibold mb-2">Catatan Admin</h3>
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                    {pengajuan.catatan_admin}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}







