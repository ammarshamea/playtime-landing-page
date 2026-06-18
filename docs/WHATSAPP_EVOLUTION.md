# WhatsApp (Evolution API)

## Start stack

From repo root:

```bash
docker compose -f infra/docker-compose.evolution.yml up -d
```

Wait ~30s, then open **http://localhost:8080/manager**.

- **API Key:** `playtime-evolution-secret-change-me` (see `infra/docker-compose.evolution.yml`)
- **Instance name:** must match `EVOLUTION_INSTANCE` in `backend/.env` (e.g. `Fayez`)

## Laravel `backend/.env`

```env
EVOLUTION_ENABLED=true
EVOLUTION_BASE_URL=http://127.0.0.1:8080
EVOLUTION_API_KEY=playtime-evolution-secret-change-me
EVOLUTION_INSTANCE=Fayez
EVOLUTION_NOTIFY_NUMBER=963981175877
```

- **Sender:** WhatsApp linked via QR on the instance (e.g. Saudi line).
- **Recipient:** `EVOLUTION_NOTIFY_NUMBER` — Syrian work line `963981175877`.

## QR code (dev)

1. Manager → instance → **Connect** / **Get QR Code**, or
2. Open `tools/evolution/whatsapp-qr.html` via a local server:

```bash
cd tools/evolution
python -m http.server 8765
```

Then http://127.0.0.1:8765/whatsapp-qr.html

Image snapshot (optional): regenerate with Evolution connect API; do not commit `whatsapp-qr.png`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Database provider invalid` | Use `infra/docker-compose.evolution.yml` (includes Postgres) |
| Empty QR / `count: 0` | Image `evoapicloud/evolution-api:v2.3.5` + `CONFIG_SESSION_PHONE_VERSION` in compose |
| Messages to “You” | Set `EVOLUTION_NOTIFY_NUMBER` to work phone, not the connected line |
| API not ready | Wait after `docker compose up`; check `docker logs playtime-evolution-api` |
| Chat says “received” but no WhatsApp | Instance disconnected — run `php artisan evolution:whatsapp-status`, then scan QR in Manager |
| `Connection Closed` / `device_removed` | WhatsApp unlinked the device — Manager → Connect → scan QR again on the phone |

## Test

```bash
curl -X POST http://127.0.0.1:8001/api/contact-messages \
  -H "Content-Type: application/json" \
  -d '{"phone":"0912345678","message":"test","locale":"ar"}'
```

Check `contact_messages.whatsapp_sent_at` / `whatsapp_error`.

```bash
cd backend && php artisan evolution:whatsapp-status
```

Must show `Connection state: open` before contact messages reach WhatsApp.
