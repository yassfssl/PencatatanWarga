<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengajuanWargaController;
use App\Http\Controllers\WargaPdfController;
use App\Http\Controllers\ActivityLogController;
use App\Models\PengajuanWarga;
use App\Models\Warga;
use Carbon\Carbon;

Route::get('/', function () {
    // Hitung statistik dari database
    $totalWarga = Warga::count();
    
    // Data Akurat: persentase data yang memiliki NIK valid (16 digit) dan data lengkap
    $dataLengkap = Warga::whereNotNull('nik')
        ->whereNotNull('nama_lengkap')
        ->whereNotNull('tanggal_lahir')
        ->whereNotNull('alamat')
        ->whereNotNull('rt')
        ->whereNotNull('rw')
        ->count();
    $dataAkurat = $totalWarga > 0 ? round(($dataLengkap / $totalWarga) * 100) : 0;
    
    // RT/RW Terhubung: hitung unique kombinasi RT/RW
    $rtRwTerhubung = Warga::select('rt', 'rw')
        ->groupBy('rt', 'rw')
        ->count();
    
    // Aktif Harian: data yang diupdate hari ini
    $aktifHarian = Warga::whereDate('updated_at', Carbon::today())
        ->count();
    
    // Penduduk Aktif: total warga
    $pendudukAktif = $totalWarga;
    
    // Usia Produktif: warga dengan usia 20-45 tahun
    $tanggalSekarang = Carbon::now();
    $tanggalMin = $tanggalSekarang->copy()->subYears(45);
    $tanggalMax = $tanggalSekarang->copy()->subYears(20);
    $usiaProduktif = Warga::whereBetween('tanggal_lahir', [$tanggalMin, $tanggalMax])
        ->count();
    $persenUsiaProduktif = $totalWarga > 0 ? round(($usiaProduktif / $totalWarga) * 100) : 0;
    
    // Pembaruan Minggu Ini: data yang diupdate dalam 7 hari terakhir
    $pembaruanMingguIni = Warga::where('updated_at', '>=', Carbon::now()->subDays(7))
        ->count();
    
    // Distribusi Jenis Kelamin per RT untuk grafik garis
    $distribusiJenisKelamin = Warga::select('rt', 'jenis_kelamin')
        ->selectRaw('COUNT(*) as jumlah')
        ->groupBy('rt', 'jenis_kelamin')
        ->orderBy('rt')
        ->get();
    
    // Format data untuk grafik: per RT, jumlah Laki-laki dan Perempuan
    $chartData = [];
    $rtList = Warga::select('rt')->distinct()->orderBy('rt')->pluck('rt');
    
    foreach ($rtList as $rt) {
        $lakiLaki = $distribusiJenisKelamin->where('rt', $rt)->where('jenis_kelamin', 'Laki-laki')->sum('jumlah');
        $perempuan = $distribusiJenisKelamin->where('rt', $rt)->where('jenis_kelamin', 'Perempuan')->sum('jumlah');
        
        if ($lakiLaki > 0 || $perempuan > 0) {
            $chartData[] = [
                'rt' => 'RT ' . $rt,
                'Laki-laki' => $lakiLaki,
                'Perempuan' => $perempuan,
            ];
        }
    }
    
    // Jika tidak ada data per RT, buat data total
    if (empty($chartData)) {
        $totalLakiLaki = Warga::where('jenis_kelamin', 'Laki-laki')->count();
        $totalPerempuan = Warga::where('jenis_kelamin', 'Perempuan')->count();
        $chartData = [
            [
                'rt' => 'Total',
                'Laki-laki' => $totalLakiLaki,
                'Perempuan' => $totalPerempuan,
            ],
        ];
    }
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'stats' => [
            'dataAkurat' => $dataAkurat,
            'rtRwTerhubung' => $rtRwTerhubung,
            'aktifHarian' => $aktifHarian,
            'pendudukAktif' => $pendudukAktif,
            'usiaProduktif' => $usiaProduktif,
            'persenUsiaProduktif' => $persenUsiaProduktif,
            'pembaruanMingguIni' => $pembaruanMingguIni,
        ],
        'chartData' => $chartData,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dashboard/analytics', [DashboardController::class, 'analytics'])->name('dashboard.analytics');

    // Route export harus didefinisikan SEBELUM resource untuk menghindari conflict
    Route::get('warga/export', [WargaController::class, 'export'])->name('warga.export');
    Route::resource('warga', WargaController::class);
    
    // Routes untuk pengajuan perubahan data
    Route::get('pengajuan', [PengajuanWargaController::class, 'index'])->name('pengajuan.index');
    Route::get('pengajuan/create', [PengajuanWargaController::class, 'create'])->name('pengajuan.create');
    Route::post('pengajuan', [PengajuanWargaController::class, 'store'])->name('pengajuan.store');
    Route::get('pengajuan/{pengajuan}', [PengajuanWargaController::class, 'show'])->name('pengajuan.show');
    
    // Routes khusus admin untuk approve/reject
    Route::post('pengajuan/{pengajuan}/approve', [PengajuanWargaController::class, 'approve'])->name('pengajuan.approve');
    Route::post('pengajuan/{pengajuan}/reject', [PengajuanWargaController::class, 'reject'])->name('pengajuan.reject');
    
    // Route untuk download PDF data pribadi warga
    Route::get('warga/pdf/download', [WargaPdfController::class, 'download'])->name('warga.pdf.download');
    
    // Routes untuk log aktivitas (admin only)
    Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
});

require __DIR__.'/settings.php';
