<?php

namespace App\Http\Controllers;

use App\Helpers\ActivityLogger;
use App\Models\PengajuanWarga;
use App\Models\Warga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanWargaController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $status = $request->string('status')->toString();
            $search = $request->string('search')->toString();

            $query = PengajuanWarga::with(['warga', 'user', 'admin'])
                ->orderByDesc('created_at');

            if ($status !== '' && in_array($status, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $status);
            }

            if ($search !== '') {
                $query->whereHas('warga', function ($q) use ($search) {
                    $q->where('nik', 'like', "%{$search}%")
                      ->orWhere('nama_lengkap', 'like', "%{$search}%");
                });
            }

            $pengajuan = $query->paginate(10)->withQueryString();

            $stats = [
                'pending' => PengajuanWarga::where('status', 'pending')->count(),
                'approved' => PengajuanWarga::where('status', 'approved')->count(),
                'rejected' => PengajuanWarga::where('status', 'rejected')->count(),
            ];

            return Inertia::render('admin/pengajuan/index', [
                'pengajuan' => $pengajuan,
                'stats' => $stats,
                'filters' => [
                    'status' => $status,
                    'search' => $search,
                ],
            ]);
        }

        // Untuk warga: hanya lihat pengajuan mereka sendiri
        $pengajuan = PengajuanWarga::with(['warga', 'admin'])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('user/pengajuan/index', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function create(): Response
    {
        $user = request()->user();
        $warga = $user->warga;

        if (!$warga) {
            abort(404, 'Data warga tidak ditemukan');
        }

        return Inertia::render('user/pengajuan/create', [
            'warga' => $warga,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $warga = $user->warga;

        if (!$warga) {
            return redirect()->back()->withErrors(['error' => 'Data warga tidak ditemukan']);
        }

        $validated = $request->validate([
            'data_perubahan' => ['required', 'array'],
            'alasan' => ['nullable', 'string', 'max:500'],
        ]);

        // Validasi bahwa data_perubahan hanya berisi field yang diizinkan
        $allowedFields = [
            'alamat', 'no_telepon', 'pekerjaan', 'pendidikan',
            'rt', 'rw', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos'
        ];

        $dataPerubahan = [];
        foreach ($validated['data_perubahan'] as $field => $value) {
            if (in_array($field, $allowedFields)) {
                $dataPerubahan[$field] = $value;
            }
        }

        if (empty($dataPerubahan)) {
            return redirect()->back()->withErrors(['error' => 'Tidak ada perubahan data yang valid']);
        }

        // Cek apakah ada pengajuan pending untuk warga ini
        $pendingPengajuan = PengajuanWarga::where('warga_id', $warga->id)
            ->where('status', 'pending')
            ->exists();

        if ($pendingPengajuan) {
            return redirect()->back()->withErrors(['error' => 'Anda masih memiliki pengajuan yang belum ditinjau']);
        }

        $pengajuan = PengajuanWarga::create([
            'warga_id' => $warga->id,
            'user_id' => $user->id,
            'data_perubahan' => $dataPerubahan,
            'alasan' => $validated['alasan'] ?? null,
            'status' => 'pending',
        ]);

        ActivityLogger::log('create', $pengajuan, null, $pengajuan->toArray(), "Mengajukan perubahan data untuk warga: {$warga->nama_lengkap}", $request);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan perubahan data berhasil dikirim');
    }

    public function show(PengajuanWarga $pengajuan): Response
    {
        $user = request()->user();

        // Warga hanya bisa lihat pengajuan mereka sendiri
        if ($user->isWarga() && $pengajuan->user_id !== $user->id) {
            abort(403);
        }

        $pengajuan->load(['warga', 'user', 'admin']);

        if ($user->isAdmin()) {
            return Inertia::render('admin/pengajuan/show', [
                'pengajuan' => $pengajuan,
            ]);
        }

        return Inertia::render('user/pengajuan/show', [
            'pengajuan' => $pengajuan,
        ]);
    }

    public function approve(Request $request, PengajuanWarga $pengajuan): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($pengajuan->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Pengajuan ini sudah ditinjau']);
        }

        $validated = $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        $warga = $pengajuan->warga;
        $dataPerubahan = $pengajuan->data_perubahan;

        // Update data warga dengan data perubahan
        $oldWargaValues = $warga->toArray();
        $warga->update($dataPerubahan);
        $warga->refresh();

        // Update status pengajuan
        $oldPengajuanValues = $pengajuan->toArray();
        $pengajuan->update([
            'status' => 'approved',
            'admin_id' => $request->user()->id,
            'catatan_admin' => $validated['catatan_admin'] ?? null,
            'reviewed_at' => now(),
        ]);
        $pengajuan->refresh();

        ActivityLogger::log('approve', $pengajuan, $oldPengajuanValues, $pengajuan->toArray(), "Menyetujui pengajuan perubahan data untuk warga: {$warga->nama_lengkap}", $request);
        ActivityLogger::log('update', $warga, $oldWargaValues, $warga->toArray(), "Memperbarui data warga melalui pengajuan yang disetujui: {$warga->nama_lengkap}", $request);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil disetujui dan data warga telah diperbarui');
    }

    public function reject(Request $request, PengajuanWarga $pengajuan): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($pengajuan->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'Pengajuan ini sudah ditinjau']);
        }

        $validated = $request->validate([
            'catatan_admin' => ['required', 'string', 'max:500'],
        ]);

        $oldValues = $pengajuan->toArray();
        $pengajuan->update([
            'status' => 'rejected',
            'admin_id' => $request->user()->id,
            'catatan_admin' => $validated['catatan_admin'],
            'reviewed_at' => now(),
        ]);
        $pengajuan->refresh();

        ActivityLogger::log('reject', $pengajuan, $oldValues, $pengajuan->toArray(), "Menolak pengajuan perubahan data untuk warga: {$pengajuan->warga->nama_lengkap}", $request);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan ditolak');
    }

    private function authorizeAdmin(): void
    {
        abort_unless(request()->user()?->isAdmin(), 403);
    }
}
