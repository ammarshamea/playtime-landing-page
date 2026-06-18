<?php

namespace App\Services;

use App\Models\ContactMessage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EvolutionWhatsAppService
{
    public function isEnabled(): bool
    {
        return (bool) config('evolution.enabled')
            && config('evolution.api_key') !== ''
            && config('evolution.instance') !== '';
    }

    public function getConnectionState(): string
    {
        if (! $this->isEnabled()) {
            return 'disabled';
        }

        $instance = config('evolution.instance');
        $url = config('evolution.base_url').'/instance/connectionState/'.$instance;

        try {
            $response = Http::timeout(5)
                ->withHeaders(['apikey' => config('evolution.api_key')])
                ->get($url);

            if (! $response->successful()) {
                return 'unknown';
            }

            $state = $response->json('instance.state');

            return is_string($state) ? $state : 'unknown';
        } catch (\Throwable $e) {
            Log::debug('Evolution connectionState check failed', ['message' => $e->getMessage()]);

            return 'unknown';
        }
    }

    public function isInstanceConnected(): bool
    {
        return $this->getConnectionState() === 'open';
    }

    /**
     * Send contact form details to the work WhatsApp number via Evolution API.
     *
     * @return array{ok: bool, error: ?string}
     */
    public function sendContactNotification(ContactMessage $contactMessage): array
    {
        if (! $this->isEnabled()) {
            return ['ok' => false, 'error' => 'Evolution API is disabled or not configured.'];
        }

        if (! $this->isInstanceConnected()) {
            return [
                'ok' => false,
                'error' => 'WhatsApp session is disconnected. Reconnect via Evolution Manager (scan QR).',
            ];
        }

        $recipient = PhoneNormalizer::normalize((string) config('evolution.notify_number'));
        if (strlen($recipient) < 10) {
            return ['ok' => false, 'error' => 'Invalid EVOLUTION_NOTIFY_NUMBER.'];
        }

        $instance = config('evolution.instance');
        $url = config('evolution.base_url').'/message/sendText/'.$instance;

        $text = $this->formatNotificationText($contactMessage);

        try {
            $response = Http::timeout((int) config('evolution.timeout_seconds', 15))
                ->withHeaders([
                    'apikey' => config('evolution.api_key'),
                    'Content-Type' => 'application/json',
                ])
                ->post($url, [
                    'number' => $recipient,
                    'text' => $text,
                ]);

            if ($response->successful()) {
                return ['ok' => true, 'error' => null];
            }

            $body = $response->json() ?? [];
            $error = $this->extractErrorMessage($body, $response->body());

            Log::warning('Evolution API sendText failed', [
                'status' => $response->status(),
                'error' => $error,
                'connection_state' => $this->getConnectionState(),
                'contact_message_id' => $contactMessage->id,
            ]);

            return ['ok' => false, 'error' => 'Evolution API error: '.$error];
        } catch (\Throwable $e) {
            Log::error('Evolution API request exception', [
                'message' => $e->getMessage(),
                'contact_message_id' => $contactMessage->id,
            ]);

            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * @param  array<string, mixed>|mixed  $body
     */
    private function extractErrorMessage(array $body, string $rawBody): string
    {
        $nested = $body['response']['message'] ?? null;
        if (is_string($nested) && $nested !== '') {
            return $nested;
        }

        $message = $body['message'] ?? $body['error'] ?? null;
        if (is_string($message) && $message !== '') {
            return $message;
        }

        return $rawBody !== '' ? substr($rawBody, 0, 200) : 'Unknown error';
    }

    public function formatNotificationText(ContactMessage $contactMessage): string
    {
        $phoneDisplay = $contactMessage->phone;
        $pageUrl = $contactMessage->page_url ?: '—';
        $sentAt = $contactMessage->created_at?->timezone(config('app.timezone'))
            ->format('Y-m-d H:i') ?? now()->format('Y-m-d H:i');

        $lines = [
            '🔔 رسالة جديدة — Playtime',
            '',
            '📱 الزبون: '.$phoneDisplay,
            '',
            '💬 الرسالة:',
            $contactMessage->message,
            '',
            '🌐 '.$pageUrl,
            '🕐 '.$sentAt,
        ];

        if ($contactMessage->locale) {
            $lines[] = '🌐 لغة: '.$contactMessage->locale;
        }

        return implode("\n", $lines);
    }
}
