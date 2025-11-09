<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    public static function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null,
        ?Request $request = null
    ): ActivityLog {
        $user = $request?->user();
        $ipAddress = $request?->ip();
        $userAgent = $request?->userAgent();

        return ActivityLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'description' => $description ?? self::generateDescription($action, $model),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    private static function generateDescription(string $action, Model $model): string
    {
        $modelName = class_basename($model);
        
        return match($action) {
            'create' => "Membuat data {$modelName} baru",
            'update' => "Memperbarui data {$modelName}",
            'delete' => "Menghapus data {$modelName}",
            'approve' => "Menyetujui {$modelName}",
            'reject' => "Menolak {$modelName}",
            default => "Melakukan aksi {$action} pada {$modelName}",
        };
    }
}



