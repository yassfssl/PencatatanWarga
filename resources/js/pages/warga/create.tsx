import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WargaForm from '@/components/warga-form';
import { type BreadcrumbItem } from '@/types';

type PageProps = {
  users: { id: number; name: string; email: string; role: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Warga', href: '/warga' },
  { title: 'Tambah', href: '/warga/create' },
];

export default function WargaCreate() {
  const { props } = usePage<PageProps>();
  const { data, setData, post, processing, errors } = useForm({
    nik: '',
    nama_lengkap: '',
    jenis_kelamin: '' as any,
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: '' as any,
    pendidikan: '',
    pekerjaan: '',
    status_perkawinan: '' as any,
    alamat: '',
    rt: '',
    rw: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    no_telepon: '',
    user_id: null as any,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/warga');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Warga" />
      <div className="p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Tambah Warga</CardTitle>
            <Link href="/warga"><Button variant="outline">Kembali</Button></Link>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <WargaForm data={data as any} setData={setData as any} errors={errors as any} users={props.users} />
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>Simpan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


