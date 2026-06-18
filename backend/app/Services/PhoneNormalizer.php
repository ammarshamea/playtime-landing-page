<?php

namespace App\Services;

class PhoneNormalizer
{
    /**
     * Normalize Syrian mobile numbers for storage (digits only, prefer 9639…).
     */
    public static function normalize(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone) ?? '';

        if (str_starts_with($digits, '00963')) {
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '963')) {
            return $digits;
        }

        if (str_starts_with($digits, '0')) {
            return '963'.ltrim($digits, '0');
        }

        if (strlen($digits) === 9 && str_starts_with($digits, '9')) {
            return '963'.$digits;
        }

        return $digits;
    }
}
