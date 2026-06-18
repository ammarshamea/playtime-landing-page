<?php

return [

    'enabled' => env('EVOLUTION_ENABLED', false),

    'base_url' => rtrim(env('EVOLUTION_BASE_URL', 'http://127.0.0.1:8080'), '/'),

    'api_key' => env('EVOLUTION_API_KEY', ''),

    'instance' => env('EVOLUTION_INSTANCE', 'Fayez'),

    'notify_number' => env('EVOLUTION_NOTIFY_NUMBER', '963981175877'),

    'timeout_seconds' => (int) env('EVOLUTION_TIMEOUT', 15),

];
