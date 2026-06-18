# Environment variables

## `backend/.env`

| Variable | Example | Purpose |
|----------|---------|---------|
| `APP_URL` | `http://localhost:8001` | Laravel base URL |
| `DB_CONNECTION` | `mysql` | Database driver |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_DATABASE` | `playtime` | Database name |
| `DB_USERNAME` | `root` | MySQL user |
| `DB_PASSWORD` | *(empty for XAMPP)* | MySQL password |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,...` | Allowed web origins |
| `EVOLUTION_ENABLED` | `true` | Enable WhatsApp notifications |
| `EVOLUTION_BASE_URL` | `http://127.0.0.1:8080` | Evolution API |
| `EVOLUTION_API_KEY` | same as Docker `AUTHENTICATION_API_KEY` | API auth |
| `EVOLUTION_INSTANCE` | `Fayez` | Instance name in Manager |
| `EVOLUTION_NOTIFY_NUMBER` | `963981175877` | Recipient (work WhatsApp) |

Copy from `backend/.env.example`.

## Exchange rate API (Laravel → external, token server-side only)

| Variable | Purpose |
|----------|---------|
| `EXCHANGE_RATE_API_BASE_URL` | e.g. `http://82.29.180.176:5000` |
| `EXCHANGE_RATE_API_TOKEN` | Token from your provider (never in frontend) |

Endpoint: `GET /api/exchange-rate/usd`

## `web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Copy from `web/.env.local.example` if present.

## Docker (`infra/docker-compose.evolution.yml`)

| Variable | Default |
|----------|---------|
| `AUTHENTICATION_API_KEY` | `playtime-evolution-secret-change-me` |

Change in production and mirror in `backend/.env`.
