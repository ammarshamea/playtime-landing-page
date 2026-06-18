<?php

use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\ExchangeRateController;
use Illuminate\Support\Facades\Route;

Route::get('/exchange-rate/usd', [ExchangeRateController::class, 'usd'])
    ->middleware(['throttle:exchange-rate', \App\Http\Middleware\AllowExchangeRateOrigin::class]);

Route::post('/contact-messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:contact-messages');
