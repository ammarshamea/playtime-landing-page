<?php

namespace App\Console\Commands;

use App\Services\EvolutionWhatsAppService;
use Illuminate\Console\Command;

class EvolutionWhatsAppStatusCommand extends Command
{
    protected $signature = 'evolution:whatsapp-status';

    protected $description = 'Show Evolution API WhatsApp connection status for contact notifications';

    public function handle(EvolutionWhatsAppService $evolution): int
    {
        if (! $evolution->isEnabled()) {
            $this->error('Evolution is disabled. Set EVOLUTION_ENABLED=true in backend/.env');

            return self::FAILURE;
        }

        $state = $evolution->getConnectionState();
        $this->line('Instance: '.config('evolution.instance'));
        $this->line('Base URL: '.config('evolution.base_url'));
        $this->line('Notify number: '.config('evolution.notify_number'));
        $this->line('Connection state: '.$state);

        if ($state === 'open') {
            $this->info('WhatsApp is connected — contact form messages will be delivered.');

            return self::SUCCESS;
        }

        $this->warn('WhatsApp is NOT connected — messages are saved but not sent to WhatsApp.');
        $this->line('');
        $this->line('Reconnect:');
        $this->line('  1. From repo root (not backend/): evolution-up.bat');
        $this->line('     or: docker compose -f infra/docker-compose.evolution.yml up -d');
        $this->line('  2. Open http://localhost:8080/manager → instance «'.config('evolution.instance').'» → Connect / QR');
        $this->line('  Or: cd EvolutionAPI && python run.py');

        return self::FAILURE;
    }
}
