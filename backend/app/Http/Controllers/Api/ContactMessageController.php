<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use App\Services\EvolutionWhatsAppService;
use App\Services\PhoneNormalizer;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function __construct(
        private readonly EvolutionWhatsAppService $evolutionWhatsApp,
    ) {}

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        if (filled($request->input('website'))) {
            return response()->json([
                'success' => true,
                'message' => 'Message received successfully',
            ], 201);
        }

        $contactMessage = ContactMessage::query()->create([
            'phone' => PhoneNormalizer::normalize($request->string('phone')->toString()),
            'message' => $request->string('message')->toString(),
            'source' => $request->string('source')->toString() ?: 'floating_whatsapp_widget',
            'page_url' => $request->string('page_url')->toString() ?: null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'locale' => $request->string('locale')->toString() ?: null,
            'status' => ContactMessage::STATUS_NEW,
        ]);

        $whatsappDelivered = $this->notifyWorkWhatsApp($contactMessage);

        return response()->json([
            'success' => true,
            'message' => 'Message received successfully',
            'whatsapp_delivered' => $whatsappDelivered,
        ], 201);
    }

    private function notifyWorkWhatsApp(ContactMessage $contactMessage): bool
    {
        if (! $this->evolutionWhatsApp->isEnabled()) {
            return false;
        }

        $result = $this->evolutionWhatsApp->sendContactNotification($contactMessage);

        if ($result['ok']) {
            $contactMessage->update([
                'whatsapp_sent_at' => now(),
                'whatsapp_error' => null,
            ]);

            return true;
        }

        $contactMessage->update([
            'whatsapp_error' => $result['error'],
        ]);

        return false;
    }
}
