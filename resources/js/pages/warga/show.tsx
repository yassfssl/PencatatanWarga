import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

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

type PageProps = { warga: Warga | null; readOnly?: boolean; missing?: boolean };

export default function WargaShow() {
  const { props } = usePage<PageProps>();
  const { warga, readOnly = false, missing = false } = props;

  const breadcrumbs: BreadcrumbItem[] = warga
    ? [
        { title: 'Warga', href: '/warga' },
        { title: warga.nama_lengkap, href: `/warga/${warga.id}` },
      ]
    : [{ title: 'Warga', href: '/warga' }];

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 font-medium">{value || '-'}</div>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={warga ? `Detail ${warga.nama_lengkap}` : 'Data Warga'} />
      <div className="p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Detail Warga</CardTitle>
            {!readOnly && warga && (
              <div className="flex gap-2">
                <Link href={`/warga/${warga.id}/edit`}><Button variant="secondary">Edit</Button></Link>
                <Link href="/warga"><Button variant="outline">Kembali</Button></Link>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {missing && (
              <div className="rounded-md border border-dashed border-muted-foreground/40 p-6 text-center text-muted-foreground">
                Data warga Anda belum tersedia. Silakan hubungi admin untuk memperbarui informasi.
              </div>
            )}

            {!missing && warga && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Field label="NIK" value={warga.nik} />
                  <Field label="Nama Lengkap" value={warga.nama_lengkap} />
                  <Field label="Jenis Kelamin" value={warga.jenis_kelamin} />
                  <Field label="Tempat Lahir" value={warga.tempat_lahir} />
                  <Field label="Tanggal Lahir" value={warga.tanggal_lahir} />
                  <Field label="Agama" value={warga.agama} />
                  <Field label="Status Perkawinan" value={warga.status_perkawinan} />
                </div>
                <div className="space-y-3">
                  <Field label="Alamat" value={warga.alamat} />
                  <Field label="RT/RW" value={`${warga.rt}/${warga.rw}`} />
                  <Field label="Kelurahan" value={warga.kelurahan} />
                  <Field label="Kecamatan" value={warga.kecamatan} />
                  <Field label="Kota" value={warga.kota} />
                  <Field label="Provinsi" value={warga.provinsi} />
                  <Field label="Kode Pos" value={warga.kode_pos} />
                  <Field label="No. Telepon" value={warga.no_telepon} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


