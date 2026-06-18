<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowExchangeRateOrigin
{
    /**
     * Only allow exchange-rate requests from configured site origins (not direct API abuse).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowed = array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))));

        if ($allowed === []) {
            return $next($request);
        }

        $origin = $request->headers->get('Origin');
        $referer = $request->headers->get('Referer');

        if ($origin !== null && in_array($origin, $allowed, true)) {
            return $next($request);
        }

        if ($referer !== null) {
            foreach ($allowed as $base) {
                if (str_starts_with($referer, rtrim($base, '/').'/') || $referer === rtrim($base, '/')) {
                    return $next($request);
                }
            }
        }

        // Same-origin server tools (curl without Origin) — allow in local only
        if (app()->environment('local') && $origin === null && $referer === null) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'غير مصرح.',
        ], 403);
    }
}
