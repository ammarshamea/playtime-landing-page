<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExchangeRateService
{
    /** One Syrian pound added to the API sell rate before conversion. */
    public const RATE_OFFSET_SYP = 1;

    /**
     * @return array{rate: float, fetched_at: string}
     */
    public function getUsdToSypRate(): array
    {
        return Cache::remember('usd_exchange_rate_v2', now()->addMinutes(30), function () {
            $token = config('services.exchange_rate.token');
            $baseUrl = rtrim((string) config('services.exchange_rate.base_url'), '/');

            if ($token === null || $token === '') {
                throw new \RuntimeException('Exchange rate API token is not configured.');
            }

            $response = Http::timeout(8)
                ->acceptJson()
                ->get($baseUrl.'/api/usd', ['token' => $token]);

            if (! $response->successful()) {
                throw new \RuntimeException('Exchange rate API request failed.');
            }

            $json = $response->json();

            if (! ($json['success'] ?? false) || empty($json['data']['sell_syp'])) {
                throw new \RuntimeException('Invalid exchange rate response.');
            }

            $sellSyp = (float) $json['data']['sell_syp'];
            $rate = $sellSyp + self::RATE_OFFSET_SYP;

            return [
                'rate' => $rate,
                'fetched_at' => $json['data']['fetched_at'] ?? now()->toIso8601String(),
            ];
        });
    }

    public static function convertUsdToSyp(float $priceUsd, float $rate): int
    {
        return (int) round($priceUsd * $rate);
    }
}
