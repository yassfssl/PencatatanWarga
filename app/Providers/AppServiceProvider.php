<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Paksa semua URL menjadi HTTPS saat di hosting (contoh Railway, Vercel, dll)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
