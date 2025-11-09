<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengajuanWarga extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_warga';

    protected $fillable = [
        'warga_id',
        'user_id',
        'data_perubahan',
        'alasan',
        'status',
        'admin_id',
        'catatan_admin',
        'reviewed_at',
    ];

    protected $casts = [
        'data_perubahan' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function warga(): BelongsTo
    {
        return $this->belongsTo(Warga::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
