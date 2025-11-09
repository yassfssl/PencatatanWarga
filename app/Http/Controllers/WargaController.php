<?php

namespace App\Http\Controllers;

use App\Helpers\ActivityLogger;
use App\Models\User;
use App\Models\Warga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WargaController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $search = $request->string('search')->toString();
            $rt = $request->string('rt')->toString();
            $rw = $request->string('rw')->toString();

            $query = Warga::with('user:id,name');

            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('nik', 'like', "%{$search}%")
                      ->orWhere('nama_lengkap', 'like', "%{$search}%")
                      ->orWhere('alamat', 'like', "%{$search}%");
                });
            }

            if ($rt !== '') {
                $query->where('rt', $rt);
            }

            if ($rw !== '') {
                $query->where('rw', $rw);
            }

            $warga = $query->orderByDesc('id')->paginate(10)->withQueryString();

            return Inertia::render('warga/index', [
                'warga' => $warga,
                'filters' => [
                    'search' => $search,
                    'rt' => $rt,
                    'rw' => $rw,
                ],
                'isAdmin' => true,
            ]);
        }

        $warga = $user->warga;

        return Inertia::render('warga/show', [
            'warga' => $warga,
            'readOnly' => true,
            'missing' => $warga === null,
        ]);
    }

    public function create(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('warga/create', [
            'users' => User::orderBy('name')->get(['id', 'name', 'email', 'role']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $data = $this->validateData($request);
        $warga = Warga::create($data);
        
        ActivityLogger::log('create', $warga, null, $warga->toArray(), "Menambahkan data warga baru: {$warga->nama_lengkap}", $request);
        
        return redirect()->route('warga.index')->with('success', 'Data warga berhasil ditambahkan');
    }

    public function show(Warga $warga): Response
    {
        $this->authorizeView($warga);

        $user = request()->user();

        return Inertia::render('warga/show', [
            'warga' => $warga,
            'readOnly' => ! $user?->isAdmin(),
            'missing' => false,
        ]);
    }

    public function edit(Warga $warga): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('warga/edit', [
            'warga' => $warga,
            'users' => User::orderBy('name')->get(['id', 'name', 'email', 'role']),
        ]);
    }

    public function update(Request $request, Warga $warga): RedirectResponse
    {
        $this->authorizeAdmin();

        $oldValues = $warga->toArray();
        $data = $this->validateData($request, $warga->id);
        $warga->update($data);
        $warga->refresh();
        
        ActivityLogger::log('update', $warga, $oldValues, $warga->toArray(), "Memperbarui data warga: {$warga->nama_lengkap}", $request);
        
        return redirect()->route('warga.index')->with('success', 'Data warga berhasil diperbarui');
    }

    public function destroy(Warga $warga): RedirectResponse
    {
        $this->authorizeAdmin();

        $oldValues = $warga->toArray();
        $namaLengkap = $warga->nama_lengkap;
        
        ActivityLogger::log('delete', $warga, $oldValues, null, "Menghapus data warga: {$namaLengkap}", request());
        
        $warga->delete();
        return redirect()->route('warga.index')->with('success', 'Data warga berhasil dihapus');
    }

    public function export(Request $request)
    {
        $this->authorizeAdmin();

        $warga = Warga::orderBy('nama_lengkap')->get();

        $filename = 'data_warga_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($warga) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Header
            fputcsv($file, [
                'NIK',
                'Nama Lengkap',
                'Jenis Kelamin',
                'Tempat Lahir',
                'Tanggal Lahir',
                'Agama',
                'Pendidikan',
                'Pekerjaan',
                'Status Perkawinan',
                'Alamat',
                'RT',
                'RW',
                'Kelurahan',
                'Kecamatan',
                'Kota',
                'Provinsi',
                'Kode Pos',
                'No. Telepon',
            ]);

            // Data
            foreach ($warga as $item) {
                fputcsv($file, [
                    $item->nik,
                    $item->nama_lengkap,
                    $item->jenis_kelamin,
                    $item->tempat_lahir,
                    $item->tanggal_lahir,
                    $item->agama,
                    $item->pendidikan ?? '',
                    $item->pekerjaan ?? '',
                    $item->status_perkawinan,
                    $item->alamat,
                    $item->rt,
                    $item->rw,
                    $item->kelurahan,
                    $item->kecamatan,
                    $item->kota,
                    $item->provinsi,
                    $item->kode_pos ?? '',
                    $item->no_telepon ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        $uniqueNik = 'unique:warga,nik';
        if ($ignoreId) {
            $uniqueNik .= ',' . $ignoreId;
        }

        return $request->validate([
            'nik' => ['required', 'string', 'size:16', $uniqueNik],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'tempat_lahir' => ['required', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date'],
            'agama' => ['required', 'in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu'],
            'pendidikan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'status_perkawinan' => ['required', 'in:Belum Menikah,Menikah,Cerai Hidup,Cerai Mati'],
            'alamat' => ['required', 'string'],
            'rt' => ['required', 'string', 'max:3'],
            'rw' => ['required', 'string', 'max:3'],
            'kelurahan' => ['required', 'string', 'max:100'],
            'kecamatan' => ['required', 'string', 'max:100'],
            'kota' => ['required', 'string', 'max:100'],
            'provinsi' => ['required', 'string', 'max:100'],
            'kode_pos' => ['nullable', 'string', 'max:5'],
            'no_telepon' => ['nullable', 'string', 'max:15'],
            'user_id' => ['nullable', 'exists:users,id'],
        ]);
    }

    private function authorizeAdmin(): void
    {
        abort_unless(request()->user()?->isAdmin(), 403);
    }

    private function authorizeView(Warga $warga): void
    {
        $user = request()->user();

        if (! $user) {
            abort(403);
        }

        if ($user && $user->isAdmin()) {
            return;
        }

        abort_unless($warga->user_id === $user?->id, 403);
    }
}


