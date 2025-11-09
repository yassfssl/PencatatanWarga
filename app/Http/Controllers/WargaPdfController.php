<?php

namespace App\Http\Controllers;

use App\Models\Warga;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WargaPdfController extends Controller
{
    public function download(Request $request): Response
    {
        $user = $request->user();
        $warga = $user->warga;

        if (!$warga) {
            abort(404, 'Data warga tidak ditemukan');
        }

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);

        $html = $this->generatePdfHtml($warga);

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $filename = 'Data_Pribadi_' . $warga->nama_lengkap . '_' . date('Y-m-d') . '.pdf';

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }

    private function generatePdfHtml(Warga $warga): string
    {
        $tanggalLahir = $warga->tanggal_lahir ? date('d F Y', strtotime($warga->tanggal_lahir)) : '-';
        $tanggalCetak = date('d F Y, H:i');

        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <style>
                body {
                    font-family: DejaVu Sans, sans-serif;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #333;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 20px;
                    color: #1e293b;
                }
                .header p {
                    margin: 5px 0;
                    font-size: 11px;
                    color: #64748b;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section-title {
                    background-color: #f1f5f9;
                    padding: 8px 12px;
                    font-weight: bold;
                    font-size: 13px;
                    margin-bottom: 10px;
                    border-left: 4px solid #06b6d4;
                }
                .data-row {
                    display: table;
                    width: 100%;
                    margin-bottom: 8px;
                }
                .data-label {
                    display: table-cell;
                    width: 35%;
                    font-weight: bold;
                    color: #475569;
                    padding-right: 10px;
                }
                .data-value {
                    display: table-cell;
                    color: #1e293b;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 15px;
                    border-top: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 10px;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>DATA PRIBADI WARGA</h1>
                <p>Dicetak pada: ' . $tanggalCetak . '</p>
            </div>

            <div class="section">
                <div class="section-title">INFORMASI PRIBADI</div>
                <div class="data-row">
                    <div class="data-label">NIK:</div>
                    <div class="data-value">' . htmlspecialchars($warga->nik) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Nama Lengkap:</div>
                    <div class="data-value">' . htmlspecialchars($warga->nama_lengkap) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Jenis Kelamin:</div>
                    <div class="data-value">' . htmlspecialchars($warga->jenis_kelamin) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Tempat, Tanggal Lahir:</div>
                    <div class="data-value">' . htmlspecialchars($warga->tempat_lahir) . ', ' . $tanggalLahir . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Agama:</div>
                    <div class="data-value">' . htmlspecialchars($warga->agama) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Status Perkawinan:</div>
                    <div class="data-value">' . htmlspecialchars($warga->status_perkawinan) . '</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">PENDIDIKAN & PEKERJAAN</div>
                <div class="data-row">
                    <div class="data-label">Pendidikan:</div>
                    <div class="data-value">' . htmlspecialchars($warga->pendidikan ?? '-') . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Pekerjaan:</div>
                    <div class="data-value">' . htmlspecialchars($warga->pekerjaan ?? '-') . '</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">ALAMAT</div>
                <div class="data-row">
                    <div class="data-label">Alamat:</div>
                    <div class="data-value">' . htmlspecialchars($warga->alamat) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">RT / RW:</div>
                    <div class="data-value">' . htmlspecialchars($warga->rt) . ' / ' . htmlspecialchars($warga->rw) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Kelurahan:</div>
                    <div class="data-value">' . htmlspecialchars($warga->kelurahan) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Kecamatan:</div>
                    <div class="data-value">' . htmlspecialchars($warga->kecamatan) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Kota:</div>
                    <div class="data-value">' . htmlspecialchars($warga->kota) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Provinsi:</div>
                    <div class="data-value">' . htmlspecialchars($warga->provinsi) . '</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Kode Pos:</div>
                    <div class="data-value">' . htmlspecialchars($warga->kode_pos ?? '-') . '</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">KONTAK</div>
                <div class="data-row">
                    <div class="data-label">No. Telepon:</div>
                    <div class="data-value">' . htmlspecialchars($warga->no_telepon ?? '-') . '</div>
                </div>
            </div>

            <div class="footer">
                <p>Dokumen ini dicetak secara otomatis dari Sistem Pencatatan Warga</p>
                <p>Dokumen ini sah dan dapat digunakan untuk keperluan administrasi</p>
            </div>
        </body>
        </html>';
    }
}
