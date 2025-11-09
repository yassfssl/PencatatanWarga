import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';

type Warga = {
    id: number;
    nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    pendidikan?: string;
    pekerjaan?: string;
    status_perkawinan: string;
    alamat: string;
    rt: string;
    rw: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kode_pos?: string;
    no_telepon?: string;
};

type PageProps = {
    warga: Warga | null;
    missing: boolean;
};

export default function UserDashboard() {
    const { props } = usePage<PageProps>();
    const { warga, missing } = props;

    const Field = ({ label, value }: { label: string; value?: string }) => (
        <div className="grid gap-2 rounded-lg border border-border/60 bg-card/60 p-3 md:grid-cols-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="md:col-span-2 font-medium text-foreground">{value || '-'}</div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}> 
            <Head title="Dashboard Warga" />
            <div className="space-y-6 p-4">
                <div className="flex justify-end">
                    <Link href={home().url}>
                        <Button variant="outline">Kembali ke Halaman Home</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Selamat datang</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Lihat dan pastikan data kependudukan Anda selalu mutakhir. Hubungi admin jika ada perubahan.
                        </p>
                    </CardHeader>
                    <CardContent>
                        {missing && (
                            <div className="rounded-lg border border-dashed border-muted-foreground/40 p-6 text-center text-muted-foreground">
                                Data Anda belum terdaftar di sistem. Silakan hubungi admin RT/RW untuk menambahkan informasi Anda.
                            </div>
                        )}

                        {!missing && warga && (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="NIK" value={warga.nik} />
                                    <Field label="Nama Lengkap" value={warga.nama_lengkap} />
                                    <Field label="Jenis Kelamin" value={warga.jenis_kelamin} />
                                    <Field label="Status Perkawinan" value={warga.status_perkawinan} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Tempat Lahir" value={warga.tempat_lahir} />
                                    <Field label="Tanggal Lahir" value={warga.tanggal_lahir} />
                                    <Field label="Agama" value={warga.agama} />
                                    <Field label="Pendidikan" value={warga.pendidikan} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Pekerjaan" value={warga.pekerjaan} />
                                    <Field label="No. Telepon" value={warga.no_telepon} />
                                </div>
                                <div className="space-y-4">
                                    <Field label="Alamat" value={warga.alamat} />
                                    <Field label="RT / RW" value={`${warga.rt} / ${warga.rw}`} />
                                    <Field label="Kelurahan" value={warga.kelurahan} />
                                    <Field label="Kecamatan" value={warga.kecamatan} />
                                    <Field label="Kota" value={warga.kota} />
                                    <Field label="Provinsi" value={warga.provinsi} />
                                    <Field label="Kode Pos" value={warga.kode_pos} />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = '/warga/pdf/download'}
                                    >
                                        Download Data Pribadi (PDF)
                                    </Button>
                                    <Link href={`/warga/${warga.id}`}>
                                        <Button variant="outline">Lihat Detail Lengkap</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}




