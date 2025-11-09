import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Menu, X } from 'lucide-react';

const features = [
    {
        title: 'Pencatatan Cepat',
        description:
            'tambah dan perbarui data warga hanya dalam beberapa klik dengan formulir yang rapi.',
    },
    {
        title: 'Data Terstruktur',
        description:
            'filter berdasarkan RT/RW, cari berdasarkan NIK atau nama, dan temukan data secara instan.',
    },
    {
        title: 'Dashboard Modern',
        description:
            'antarmuka yang responsif dan konsisten dengan tema gelap/terang sesuai preferensi pengguna.',
    },
];

type WelcomeStats = {
    dataAkurat: number;
    rtRwTerhubung: number;
    aktifHarian: number;
    pendudukAktif: number;
    usiaProduktif: number;
    persenUsiaProduktif: number;
    pembaruanMingguIni: number;
};

type ChartDataItem = {
    rt: string;
    'Laki-laki': number;
    'Perempuan': number;
};

type WelcomeProps = {
    canRegister?: boolean;
    stats?: WelcomeStats;
    chartData?: ChartDataItem[];
};

export default function Welcome({ canRegister = true, stats, chartData = [] }: WelcomeProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isAuthenticated = Boolean(auth?.user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Ensure auth data is always fresh when visiting home page
    useEffect(() => {
        // Reload auth data once when component mounts to ensure it's up to date
        // This fixes the issue where auth state is not updated when navigating back to home
        const timer = setTimeout(() => {
            router.reload({ only: ['auth'] });
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const ctaButtons = [
        { label: 'Masuk', href: login(), variant: 'ghost' as const, show: !isAuthenticated },
        {
            label: 'Daftar',
            href: register(),
            variant: 'ghost' as const,
            show: !isAuthenticated && canRegister,
        },
        {
            label: 'Kelola Data Warga',
            href: '/warga',
            variant: 'primary' as const,
            show: isAuthenticated,
        },
        {
            label: 'Buka Dashboard',
            href: dashboard(),
            variant: 'secondary' as const,
            show: isAuthenticated,
        },
    ].filter((btn) => btn.show);

    const heroButtons = [
        ...ctaButtons.filter((btn) => btn.variant !== 'ghost'),
        ...(isAuthenticated
            ? []
            : [
                  {
                      label: 'Masuk untuk Memulai',
                      href: login(),
                      variant: 'primary' as const,
                  },
                  ...(canRegister
                      ? [
                            {
                                label: 'Daftar Akun Baru',
                                href: register(),
                                variant: 'secondary' as const,
                            },
                        ]
                      : []),
              ]),
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Pencatatan Warga" />
            <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#38bdf833,_transparent_55%),radial-gradient(circle_at_bottom,_#f9731666,_transparent_40%)]" />
                <div className="absolute -left-1/3 top-0 h-[70vh] w-[70vh] rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -right-1/4 bottom-10 h-[60vh] w-[60vh] rounded-full bg-orange-500/10 blur-3xl" />

                <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 backdrop-blur">
                            <span className="text-lg font-semibold text-cyan-400">PW</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Pencatatan Warga
                            </p>
                            <p className="text-sm font-medium text-slate-200">
                                Sistem Administrasi RT/RW
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex flex-wrap items-center gap-3 text-sm">
                        {ctaButtons.map((button) => (
                            <Link
                                key={button.label}
                                href={button.href}
                                className={
                                    button.variant === 'primary'
                                        ? 'inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400'
                                        : button.variant === 'secondary'
                                        ? 'inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-5 py-2 font-semibold text-slate-200 transition hover:border-slate-500/70 hover:text-white'
                                        : 'inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2 font-semibold text-slate-200/80 transition hover:text-white'
                                }
                            >
                                {button.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 font-semibold text-red-200 transition hover:border-red-400/70 hover:text-white"
                            >
                                Keluar
                            </button>
                        )}
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-slate-700/80 bg-slate-900/60 backdrop-blur text-slate-200 transition hover:bg-slate-800/80"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div
                            className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                                isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        >
                            <div className="flex flex-col h-full">
                                {/* Sidebar Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                                            <span className="text-lg font-semibold text-cyan-400">PW</span>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                                Pencatatan Warga
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                                        aria-label="Close menu"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Sidebar Navigation */}
                                <nav className="flex-1 overflow-y-auto p-6 space-y-3">
                                    {ctaButtons.map((button) => (
                                        <Link
                                            key={button.label}
                                            href={button.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={
                                                button.variant === 'primary'
                                                    ? 'flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 w-full'
                                                    : button.variant === 'secondary'
                                                    ? 'flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 px-4 py-3 font-semibold text-slate-200 transition hover:border-slate-500/70 hover:text-white w-full'
                                                    : 'flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-3 font-semibold text-slate-200/80 transition hover:text-white hover:bg-slate-800/50 w-full'
                                            }
                                        >
                                            {button.label}
                                        </Link>
                                    ))}
                                    {isAuthenticated && (
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 font-semibold text-red-200 transition hover:border-red-400/70 hover:text-white hover:bg-red-500/10 w-full"
                                        >
                                            Keluar
                                        </button>
                                    )}
                                </nav>
                            </div>
                        </div>
                    </>
                )}

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-16 pt-10 lg:flex-row lg:items-start lg:gap-24">
                    <section className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.4em] text-cyan-200">
                            Sistem Informasi Warga
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                                Kendalikan data warga Anda dengan tampilan modern dan alur kerja yang simpel.
                            </h1>
                            <p className="max-w-xl text-base leading-relaxed text-slate-300">
                                Pencatatan Warga membantu pengurus RT/RW menyimpan dan memantau informasi penduduk secara terstruktur.
                                Nikmati pencarian cepat, filter pintar, serta tampilan detail yang mudah dibaca.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {heroButtons.map((button) => (
                                <Link
                                    key={`hero-${button.label}`}
                                    href={button.href}
                                    className={
                                        button.variant === 'primary'
                                            ? 'inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400'
                                            : 'inline-flex items-center gap-2 rounded-lg border border-slate-700/70 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500/70 hover:text-white'
                                    }
                                >
                                    {button.label}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-6 py-3 font-semibold text-red-200 transition hover:border-red-400/70 hover:text-white"
                                >
                                    Keluar
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6 pt-6 text-center max-sm:grid-cols-1">
                            <div className="rounded-2xl bg-slate-900/60 p-6 shadow-inner shadow-slate-800/40">
                                <p className="text-2xl font-semibold text-white sm:text-3xl">
                                    {stats?.dataAkurat ?? 0}%
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                                    Data Akurat
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-900/60 p-6 shadow-inner shadow-slate-800/40">
                                <p className="text-2xl font-semibold text-white sm:text-3xl">
                                    {stats?.rtRwTerhubung ?? 0}+
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                                    RT/RW Terhubung
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-900/60 p-6 shadow-inner shadow-slate-800/40">
                                <p className="text-2xl font-semibold text-white sm:text-3xl">
                                    {stats?.aktifHarian ?? 0}+
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                                    Aktif Harian
                                </p>
                            </div>
                        </div>

                    </section>

                    <aside className="relative flex flex-1 items-center justify-center">
                        <div className="relative w-full max-w-lg space-y-6">
                            <div className="relative w-full rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur">
                                <div className="absolute -top-6 right-6 flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                                    Real-time Insights
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                                            Ringkasan Warga
                                        </p>
                                        <p className="text-2xl font-semibold text-white">
                                            RW 005 RANCAEKEK
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                                            <span className="text-cyan-400">∞</span>
                                        </span>
                                        <span>{isAuthenticated ? auth.user.name : 'Guest'}</span>
                                    </div>
                                </div>

                                <ul className="mt-6 space-y-4 text-sm text-slate-200">
                                    <li className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Penduduk Aktif</p>
                                            <p className="text-xs text-slate-400">
                                                Total warga yang terdaftar dan tinggal di wilayah RT/RW saat ini.
                                            </p>
                                        </div>
                                        <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-200">
                                            {stats?.pendudukAktif ?? 0}
                                        </span>
                                    </li>
                                    <li className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Usia Produktif</p>
                                            <p className="text-xs text-slate-400">
                                                Rentang umur 20-45 tahun yang tercatat aktif bekerja.
                                            </p>
                                        </div>
                                        <span className="rounded-lg bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-200">
                                            {stats?.persenUsiaProduktif ?? 0}%
                                        </span>
                                    </li>
                                    <li className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                                        <div>
                                            <p className="text-sm font-semibold text-white">Pembaruan Minggu Ini</p>
                                            <p className="text-xs text-slate-400">
                                                Perubahan data terakhir yang dilakukan oleh pengurus.
                                            </p>
                                        </div>
                                        <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-200">
                                            {stats?.pembaruanMingguIni ?? 0} Data
                                        </span>
                                    </li>
                                </ul>

                                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
                                    "Sebelumnya kami menggunakan excel manual. Sejak memakai Pencatatan Warga, seluruh data bisa dicari dan diperbarui dalam hitungan detik."
                                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                                            B
                                        </span>
                                        <span>Bu Tika • Sekretaris RW 005</span>
                                    </div>
                                </div>
                            </div>

                            {chartData && chartData.length > 0 && (
                                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur">
                                    <h2 className="mb-4 text-lg font-semibold text-white">Distribusi Jenis Kelamin</h2>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                                                <XAxis 
                                                    dataKey="rt" 
                                                    stroke="#94a3b8"
                                                    style={{ fontSize: '11px' }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={60}
                                                />
                                                <YAxis 
                                                    stroke="#94a3b8"
                                                    style={{ fontSize: '11px' }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#1e293b',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px',
                                                        color: '#e2e8f0'
                                                    }}
                                                />
                                                <Legend 
                                                    wrapperStyle={{ color: '#94a3b8', fontSize: '11px' }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Laki-laki" 
                                                    stroke="#06b6d4" 
                                                    strokeWidth={2}
                                                    dot={{ fill: '#06b6d4', r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Perempuan" 
                                                    stroke="#f97316" 
                                                    strokeWidth={2}
                                                    dot={{ fill: '#f97316', r: 3 }}
                                                    activeDot={{ r: 5 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </main>

                <footer className="border-t border-slate-800/60 bg-slate-950/80 py-6">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>© {new Date().getFullYear()} Pencatatan Warga. Semua hak dilindungi.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/warga" className="hover:text-white">
                                Data Warga
                            </Link>
                            <Link href={dashboard()} className="hover:text-white">
                                Dashboard
                            </Link>
                            <a href="mailto:info@pencatatanwarga.id" className="hover:text-white">
                                Bantuan
                            </a>
                        </div>
                </div>
                </footer>
            </div>
        </>
    );
}
