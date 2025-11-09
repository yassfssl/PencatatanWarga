import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { useMemo } from 'react';

type Warga = {
  id: number;
  nik: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  alamat: string;
  rt: string;
  rw: string;
  user?: { id: number; name: string | null } | null;
};

type PageProps = {
  warga: {
    data: Warga[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
  };
  filters: { search: string; rt: string; rw: string };
  isAdmin?: boolean;
  flash?: { success?: string };
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Warga', href: '/warga' },
];

export default function WargaIndex() {
  const { props } = usePage<PageProps>();
  const { warga, filters, flash, isAdmin = false } = props;

  const onChangeFilter = (key: 'search' | 'rt' | 'rw', value: string) => {
    const query = new URLSearchParams({ ...filters });

    if (value === '' || value === 'all') {
      query.delete(key);
    } else {
      query.set(key, value);
    }

    router.get(`/warga?${query.toString()}`, {}, { preserveState: true, preserveScroll: true, replace: true });
  };

  const tableRows = useMemo(() => warga.data, [warga.data]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data Warga" />
      <div className="flex flex-col gap-4 p-4">
        {flash?.success && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
            {flash.success}
          </div>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Data Warga</CardTitle>
            {isAdmin && (
              <Link href="/warga/create">
                <Button>Tambah Warga</Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {isAdmin && (
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <Input placeholder="Cari NIK/Nama/Alamat" defaultValue={filters.search} onChange={(e) => onChangeFilter('search', e.target.value)} />
                <Select value={filters.rt || 'all'} onValueChange={(v) => onChangeFilter('rt', v)}>
                  <SelectTrigger><SelectValue placeholder="Filter RT" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua RT</SelectItem>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(3, '0')}>{String(i + 1).padStart(3, '0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.rw || 'all'} onValueChange={(v) => onChangeFilter('rw', v)}>
                  <SelectTrigger><SelectValue placeholder="Filter RW" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua RW</SelectItem>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(3, '0')}>{String(i + 1).padStart(3, '0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">NIK</th>
                    <th className="p-3">Nama</th>
                    <th className="p-3">JK</th>
                    <th className="p-3">Alamat</th>
                    <th className="p-3">RT/RW</th>
                    <th className="p-3">Pemilik Akun</th>
                    {isAdmin && <th className="p-3 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-muted/40">
                      <td className="p-3 font-mono">{row.nik}</td>
                      <td className="p-3">{row.nama_lengkap}</td>
                      <td className="p-3">{row.jenis_kelamin}</td>
                      <td className="p-3">{row.alamat}</td>
                      <td className="p-3">{row.rt}/{row.rw}</td>
                      <td className="p-3">{row.user?.name ?? '-'}</td>
                      {isAdmin && (
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/warga/${row.id}`}><Button variant="secondary">Detail</Button></Link>
                            <Link href={`/warga/${row.id}/edit`}><Button variant="outline">Edit</Button></Link>
                            <Button variant="destructive" onClick={() => router.delete(`/warga/${row.id}`)}>Hapus</Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAdmin && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {warga.links.map((l, idx) => (
                  <Link key={idx} href={l.url || '#'} preserveScroll>
                    <Button variant={l.active ? 'default' : 'outline'} disabled={!l.url} dangerouslySetInnerHTML={{ __html: l.label }} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


