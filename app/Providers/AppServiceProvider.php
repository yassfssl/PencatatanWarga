<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
		// Force HTTPS URLs in production to avoid mixed content and wrong redirect schemes
		if (app()->environment('production')) {
			URL::forceScheme('https');
			
			// If APP_URL is set, also force root URL to ensure absolute URLs use HTTPS
			$appUrl = config('app.url');
			if (is_string($appUrl) && str_starts_with($appUrl, 'https://')) {
				URL::forceRootUrl($appUrl);
			}
		}
    }
}
