import AppLayout from '@/layouts/app-layout';
import { dashboard, home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, TrendingUp, Users, Activity, FileText, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type AnalyticsData = {
    dailyRegistrations: Array<{ date: string; count: number }>;
    rtDistribution: Array<{ name: string; value: number }>;
    ageDistribution: Array<{ name: string; value: number }>;
    educationDistribution: Array<{ name: string; value: number }>;
    maritalStatusDistribution: Array<{ name: string; value: number }>;
    activityTrend: Array<{ date: string; count: number }>;
    pengajuanStatus: Array<{ name: string; value: number }>;
    realtimeStats: {
        todayRegistrations: number;
        todayActivities: number;
        weekRegistrations: number;
        weekActivities: number;
        monthRegistrations: number;
        monthActivities: number;
    };
};

type PageProps = {
    analytics?: AnalyticsData;
};

const COLORS = ['#06b6d4', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'];

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const { analytics } = props;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshData = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['analytics'],
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsRefreshing(false);
                setLastUpdate(new Date());
            },
        });
    };

    if (!analytics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Analytics" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 rounded-xl p-4">
                    <p className="text-muted-foreground">Data analytics tidak tersedia</p>
                </div>
            </AppLayout>
        );
    }

    const {
        dailyRegistrations,
        rtDistribution,
        ageDistribution,
        educationDistribution,
        maritalStatusDistribution,
        activityTrend,
        pengajuanStatus,
        realtimeStats,
    } = analytics;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header with Refresh Button */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
                        <p className="text-sm text-muted-foreground">
                            Statistik real-time dan visualisasi data warga
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={dashboard().url}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <div className="text-right text-xs text-muted-foreground hidden md:block">
                            <p>Terakhir diperbarui:</p>
                            <p className="font-medium">
                                {lastUpdate.toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </p>
                    </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Real-time Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-cyan-500/15 to-slate-900 border-cyan-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registrasi Hari Ini</CardTitle>
                            <Users className="h-4 w-4 text-cyan-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-cyan-400">
                                {realtimeStats.todayRegistrations}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {realtimeStats.weekRegistrations} dalam 7 hari terakhir
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500/15 to-slate-900 border-orange-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktivitas Hari Ini</CardTitle>
                            <Activity className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-400">
                                {realtimeStats.todayActivities}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {realtimeStats.weekActivities} dalam 7 hari terakhir
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500/15 to-slate-900 border-emerald-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registrasi Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-400">
                                {realtimeStats.monthRegistrations}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total dalam 30 hari terakhir
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500/15 to-slate-900 border-purple-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktivitas Bulan Ini</CardTitle>
                            <Clock className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-400">
                                {realtimeStats.monthActivities}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total dalam 30 hari terakhir
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Daily Registrations Trend - Area Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trend Registrasi Harian</CardTitle>
                            <CardDescription>Registrasi warga baru dalam 30 hari terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dailyRegistrations}>
                                    <defs>
                                        <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#06b6d4"
                                        fillOpacity={1}
                                        fill="url(#colorRegistrations)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Activity Trend - Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Trend Aktivitas</CardTitle>
                            <CardDescription>Aktivitas sistem dalam 7 hari terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={activityTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        dot={{ fill: '#f97316', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* RT Distribution - Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi per RT</CardTitle>
                            <CardDescription>Jumlah warga berdasarkan RT</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={rtDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Age Distribution - Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Usia</CardTitle>
                            <CardDescription>Distribusi warga berdasarkan kelompok usia</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={ageDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {ageDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Education Distribution - Bar Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Pendidikan</CardTitle>
                            <CardDescription>Jumlah warga berdasarkan tingkat pendidikan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={educationDistribution}
                                    layout="vertical"
                                    margin={{ left: 20, right: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        style={{ fontSize: '12px' }}
                                        width={100}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Marital Status Distribution - Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Perkawinan</CardTitle>
                            <CardDescription>Distribusi warga berdasarkan status perkawinan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={maritalStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {maritalStatusDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pengajuan Status - Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Pengajuan</CardTitle>
                            <CardDescription>Distribusi status pengajuan perubahan data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pengajuanStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent, value }) =>
                                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pengajuanStatus.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.name === 'Pending'
                                                        ? '#f59e0b'
                                                        : entry.name === 'Diterima'
                                                        ? '#10b981'
                                                        : '#ef4444'
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                            color: '#e2e8f0',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
