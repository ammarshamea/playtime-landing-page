<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExchangeRateService;
use Illuminate\Http\JsonResponse;

class ExchangeRateController extends Controller
{
    public function __construct(
        private readonly ExchangeRateService $exchangeRateService,
    ) {}

    /**
     * Public proxy for the site only — token and upstream URL stay server-side.
     */
    public function usd(): JsonResponse
    {
        try {
            $data = $this->exchangeRateService->getUsdToSypRate();

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'تعذر تحديث سعر الصرف حالياً. تواصل معنا لمعرفة السعر بالليرة.',
            ], 503);
        }
    }
}
