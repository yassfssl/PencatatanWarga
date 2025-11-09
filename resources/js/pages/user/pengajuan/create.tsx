import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

type Warga = {
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

type PageProps = {
    warga: Warga;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengajuan', href: '/pengajuan' },
    { title: 'Buat Pengajuan', href: '/pengajuan/create' },
];

export default function PengajuanCreate() {
    const { props } = usePage<PageProps>();
    const { warga } = props;

    const { data, setData, post, processing, errors } = useForm({
        data_perubahan: {} as Record<string, string>,
        alasan: '',
    });

    const handleFieldChange = (field: string, value: string) => {
        const newData = { ...data.data_perubahan };
        if (value === '' || value === warga[field as keyof Warga]) {
            delete newData[field];
        } else {
            newData[field] = value;
        }
        setData('data_perubahan', newData);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(data.data_perubahan).length === 0) {
            alert('Silakan isi minimal satu field yang ingin diubah');
            return;
        }
        post('/pengajuan');
    };

    const allowedFields = [
        { key: 'alamat', label: 'Alamat', type: 'text' },
        { key: 'no_telepon', label: 'No. Telepon', type: 'tel' },
        { key: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
        { key: 'pendidikan', label: 'Pendidikan', type: 'text' },
        { key: 'rt', label: 'RT', type: 'text' },
        { key: 'rw', label: 'RW', type: 'text' },
        { key: 'kelurahan', label: 'Kelurahan', type: 'text' },
        { key: 'kecamatan', label: 'Kecamatan', type: 'text' },
        { key: 'kota', label: 'Kota', type: 'text' },
        { key: 'provinsi', label: 'Provinsi', type: 'text' },
        { key: 'kode_pos', label: 'Kode Pos', type: 'text' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan Perubahan Data" />
            <div className="p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl">Pengajuan Perubahan Data</CardTitle>
                        <Link href="/pengajuan">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Nama:</strong> {warga.nama_lengkap}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>NIK:</strong> {warga.nik}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Alamat Saat Ini:</strong> {warga.alamat}, RT {warga.rt}/RW {warga.rw}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label className="text-base font-semibold mb-4 block">
                                    Pilih Field yang Ingin Diubah
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allowedFields.map((field) => {
                                        const currentValue = warga[field.key as keyof Warga] || '';
                                        const newValue = data.data_perubahan[field.key] || currentValue;
                                        return (
                                            <div key={field.key}>
                                                <Label htmlFor={field.key}>{field.label}</Label>
                                                <div className="space-y-2">
                                                    <Input
                                                        id={field.key}
                                                        type={field.type}
                                                        value={newValue}
                                                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                        placeholder={`Nilai saat ini: ${currentValue || '-'}`}
                                                    />
                                                    {currentValue && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Nilai saat ini: {currentValue}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.data_perubahan && (
                                    <p className="text-red-500 text-sm mt-2">{errors.data_perubahan}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="alasan">Alasan Perubahan (Opsional)</Label>
                                <Textarea
                                    id="alasan"
                                    value={data.alasan}
                                    onChange={(e) => setData('alasan', e.target.value)}
                                    placeholder="Jelaskan alasan perubahan data..."
                                    rows={4}
                                />
                                {errors.alasan && <p className="text-red-500 text-sm mt-1">{errors.alasan}</p>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link href="/pengajuan">
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}




