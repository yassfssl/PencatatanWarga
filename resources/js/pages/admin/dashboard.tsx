import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { home } from '@/routes';

type Warga = {
    id: number;
    nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    alamat: string;
    rt: string;
    rw: string;
    user?: { id: number; name: string | null; email: string | null } | null;
};

type PageProps = {
    warga: {
        data: Warga[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: {
        total: number;
        male: number;
        female: number;
    };
    pengajuanStats?: {
        pending: number;
        total: number;
    };
    filters: {
        search: string;
    };
};

export default function AdminDashboard() {
    const { props } = usePage<PageProps>();
    const { warga, stats, pengajuanStats, filters } = props;

    const updateSearch = (value: string) => {
        const query = value ? { search: value } : {};
        router.get('/dashboard', query, {
            replace: true,
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}> 
            <Head title="Dashboard Admin" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                        <p className="text-sm text-muted-foreground">Kelola data warga dan pengajuan</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard/analytics">
                            <Button variant="secondary">Lihat Analytics</Button>
                        </Link>
                        <Link href={home().url}>
                            <Button variant="outline">Kembali ke Home</Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">Total Warga</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold text-white">{stats.total}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Laki-laki</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">{stats.male}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Perempuan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold">{stats.female}</p>
                        </CardContent>
                    </Card>
                    {pengajuanStats && (
                        <Card className="bg-gradient-to-br from-yellow-500/15 via-slate-900 to-slate-900">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-200">Pengajuan Pending</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-semibold text-white">{pengajuanStats.pending}</p>
                                <Link href="/pengajuan" className="text-xs text-slate-400 hover:text-slate-200 mt-1 block">
                                    Lihat semua →
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-xl md:text-2xl">Data Warga</CardTitle>
                            <p className="text-xs md:text-sm text-muted-foreground">Kelola data warga dari satu tempat.</p>
                        </div>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <Input
                                placeholder="Cari NIK / Nama / Alamat"
                                defaultValue={filters.search}
                                onChange={(e) => updateSearch(e.target.value)}
                                className="w-full md:w-64"
                            />
                            <Link href="/warga/create" className="w-full md:w-auto">
                                <Button className="w-full md:w-auto">Tambah Warga</Button>
                            </Link>
                            <Button 
                                variant="outline" 
                                className="w-full md:w-auto"
                                onClick={() => window.location.href = '/warga/export'}
                            >
                                Export Data
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b text-left text-sm text-muted-foreground">
                                        <th className="p-3">NIK</th>
                                        <th className="p-3">Nama</th>
                                        <th className="p-3">Jenis Kelamin</th>
                                        <th className="p-3">Alamat</th>
                                        <th className="p-3">RT/RW</th>
                                        <th className="p-3">Akun Pengguna</th>
                                        <th className="p-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warga.data.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none hover:bg-muted/40">
                                            <td className="p-3 font-mono text-sm">{item.nik}</td>
                                            <td className="p-3 font-medium">{item.nama_lengkap}</td>
                                            <td className="p-3">{item.jenis_kelamin}</td>
                                            <td className="p-3">{item.alamat}</td>
                                            <td className="p-3">{item.rt}/{item.rw}</td>
                                            <td className="p-3">
                                                {item.user ? (
                                                    <span className="flex flex-col">
                                                        <span>{item.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{item.user.email}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs italic text-muted-foreground">Belum terhubung</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/warga/${item.id}`}>
                                                        <Button size="sm" variant="secondary">Detail</Button>
                                                    </Link>
                                                    <Link href={`/warga/${item.id}/edit`}>
                                                        <Button size="sm" variant="outline">Edit</Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => router.delete(`/warga/${item.id}`)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {warga.data.map((item) => (
                                <Card key={item.id} className="p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">NIK</p>
                                            <p className="font-mono text-sm font-medium">{item.nik}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Nama</p>
                                            <p className="font-medium">{item.nama_lengkap}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                                                <p className="text-sm">{item.jenis_kelamin}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">RT/RW</p>
                                                <p className="text-sm">{item.rt}/{item.rw}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Alamat</p>
                                            <p className="text-sm">{item.alamat}</p>
                                        </div>
                                        {item.user && (
                                            <div>
                                                <p className="text-xs text-muted-foreground">Akun Pengguna</p>
                                                <p className="text-sm font-medium">{item.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.user.email}</p>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-2 pt-2">
                                            <Link href={`/warga/${item.id}`} className="w-full">
                                                <Button size="sm" variant="secondary" className="w-full">Detail</Button>
                                            </Link>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link href={`/warga/${item.id}/edit`} className="w-full">
                                                    <Button size="sm" variant="outline" className="w-full">Edit</Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="w-full"
                                                    onClick={() => router.delete(`/warga/${item.id}`)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {warga.links.map((link, index) => (
                                <Link key={index} href={link.url || '#'} preserveScroll preserveState>
                                    <Button
                                        variant={link.active ? 'default' : 'outline'}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}




