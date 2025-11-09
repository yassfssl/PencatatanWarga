import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WargaForm from '@/components/warga-form';
import { type BreadcrumbItem } from '@/types';

type Warga = {
  id: number;
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  pendidikan?: string;
  pekerjaan?: string;
  status_perkawinan: 'Belum Menikah' | 'Menikah' | 'Cerai Hidup' | 'Cerai Mati';
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kode_pos?: string;
  no_telepon?: string;
  user_id?: number | null;
};

type PageProps = { warga: Warga; users: { id: number; name: string; email: string; role: string }[] };

export default function WargaEdit() {
  const { props } = usePage<PageProps>();
  const initial = props.warga;
  const { data, setData, put, processing, errors } = useForm({
    ...initial,
    user_id: initial.user_id ?? null,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Warga', href: '/warga' },
    { title: initial.nama_lengkap, href: `/warga/${initial.id}/edit` },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/warga/${initial.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${initial.nama_lengkap}`} />
      <div className="p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Edit Warga</CardTitle>
            <Link href="/warga"><Button variant="outline">Kembali</Button></Link>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <WargaForm data={data as any} setData={setData as any} errors={errors as any} users={props.users} />
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>Simpan Perubahan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


