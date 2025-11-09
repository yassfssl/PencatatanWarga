<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\PengajuanWarga;
use App\Models\Warga;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $search = $request->string('search')->toString();

            $tableQuery = Warga::with('user:id,name,email')->orderByDesc('created_at');

            if ($search !== '') {
                $tableQuery->where(function ($q) use ($search) {
                    $q->where('nik', 'like', "%{$search}%")
                        ->orWhere('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('alamat', 'like', "%{$search}%");
                });
            }

            $warga = $tableQuery->paginate(10)->withQueryString();

            $statsQuery = Warga::query();

            $stats = [
                'total' => (clone $statsQuery)->count(),
                'male' => (clone $statsQuery)->where('jenis_kelamin', 'Laki-laki')->count(),
                'female' => (clone $statsQuery)->where('jenis_kelamin', 'Perempuan')->count(),
            ];

            $pengajuanStats = [
                'pending' => PengajuanWarga::where('status', 'pending')->count(),
                'total' => PengajuanWarga::count(),
            ];

            return Inertia::render('admin/dashboard', [
                'warga' => $warga,
                'stats' => $stats,
                'pengajuanStats' => $pengajuanStats,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        }

        $warga = $user->warga;

        return Inertia::render('user/dashboard', [
            'warga' => $warga,
            'missing' => $warga === null,
        ]);
    }

    public function analytics(Request $request): Response
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            abort(403, 'Hanya admin yang dapat mengakses dashboard analytics');
        }

        $analytics = $this->getAnalyticsData();

        return Inertia::render('dashboard', [
            'analytics' => $analytics,
        ]);
    }

    private function getAnalyticsData(): array
    {
        $now = Carbon::now();
        $last30Days = $now->copy()->subDays(30);
        $last7Days = $now->copy()->subDays(7);

        // Daily registration trend (last 30 days)
        $dailyRegistrations = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $count = Warga::whereDate('created_at', $date->format('Y-m-d'))->count();
            $dailyRegistrations[] = [
                'date' => $date->format('M d'),
                'count' => $count,
            ];
        }

        // Distribution by RT
        $rtDistribution = Warga::select('rt')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('rt')
            ->orderBy('rt')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => 'RT ' . $item->rt,
                    'value' => $item->count,
                ];
            });

        // Distribution by Age Group
        $ageGroups = [
            ['label' => '0-17', 'min' => 0, 'max' => 17],
            ['label' => '18-25', 'min' => 18, 'max' => 25],
            ['label' => '26-35', 'min' => 26, 'max' => 35],
            ['label' => '36-45', 'min' => 36, 'max' => 45],
            ['label' => '46-55', 'min' => 46, 'max' => 55],
            ['label' => '56+', 'min' => 56, 'max' => 150],
        ];

        $ageDistribution = [];
        foreach ($ageGroups as $group) {
            if ($group['label'] === '56+') {
                // Untuk 56+, hitung semua yang lahir sebelum 56 tahun yang lalu
                $maxDate = $now->copy()->subYears($group['min']);
                $count = Warga::whereNotNull('tanggal_lahir')
                    ->where('tanggal_lahir', '<=', $maxDate)
                    ->count();
            } else {
                // Untuk kelompok usia lainnya
                $minDate = $now->copy()->subYears($group['max'] + 1)->addDay();
                $maxDate = $now->copy()->subYears($group['min']);
                $count = Warga::whereNotNull('tanggal_lahir')
                    ->whereBetween('tanggal_lahir', [$minDate, $maxDate])
                    ->count();
            }
            $ageDistribution[] = [
                'name' => $group['label'],
                'value' => $count,
            ];
        }

        // Distribution by Education
        $educationDistribution = Warga::select('pendidikan')
            ->selectRaw('COUNT(*) as count')
            ->whereNotNull('pendidikan')
            ->groupBy('pendidikan')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->pendidikan ?: 'Tidak Diketahui',
                    'value' => $item->count,
                ];
            });

        // Distribution by Marital Status
        $maritalStatusDistribution = Warga::select('status_perkawinan')
            ->selectRaw('COUNT(*) as count')
            ->whereNotNull('status_perkawinan')
            ->groupBy('status_perkawinan')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->status_perkawinan ?: 'Tidak Diketahui',
                    'value' => $item->count,
                ];
            });

        // Activity trend (last 7 days)
        $activityTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $count = ActivityLog::whereDate('created_at', $date->format('Y-m-d'))->count();
            $activityTrend[] = [
                'date' => $date->format('M d'),
                'count' => $count,
            ];
        }

        // Pengajuan status distribution
        $pengajuanStatus = [
            [
                'name' => 'Pending',
                'value' => PengajuanWarga::where('status', 'pending')->count(),
            ],
            [
                'name' => 'Diterima',
                'value' => PengajuanWarga::where('status', 'approved')->count(),
            ],
            [
                'name' => 'Ditolak',
                'value' => PengajuanWarga::where('status', 'rejected')->count(),
            ],
        ];

        // Real-time stats
        $realtimeStats = [
            'todayRegistrations' => Warga::whereDate('created_at', $now->format('Y-m-d'))->count(),
            'todayActivities' => ActivityLog::whereDate('created_at', $now->format('Y-m-d'))->count(),
            'weekRegistrations' => Warga::where('created_at', '>=', $last7Days)->count(),
            'weekActivities' => ActivityLog::where('created_at', '>=', $last7Days)->count(),
            'monthRegistrations' => Warga::where('created_at', '>=', $last30Days)->count(),
            'monthActivities' => ActivityLog::where('created_at', '>=', $last30Days)->count(),
        ];

        return [
            'dailyRegistrations' => $dailyRegistrations,
            'rtDistribution' => $rtDistribution,
            'ageDistribution' => $ageDistribution,
            'educationDistribution' => $educationDistribution,
            'maritalStatusDistribution' => $maritalStatusDistribution,
            'activityTrend' => $activityTrend,
            'pengajuanStatus' => $pengajuanStatus,
            'realtimeStats' => $realtimeStats,
        ];
    }
}




