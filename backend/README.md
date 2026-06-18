# Backend API (Laravel)

Contact messages from the landing site + optional WhatsApp notifications via Evolution API.

## Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Run

```bash
php artisan serve --port=8001
```

Base URL: `http://localhost:8001`

## Endpoint

`POST /api/contact-messages`

```json
{
  "phone": "0981175877",
  "message": "مرحباً",
  "page_url": "http://localhost:3000/ar",
  "source": "floating_whatsapp_widget",
  "locale": "ar"
}
```

Rate limit: **5 requests/minute** per IP. Honeypot field: `website`.

## CORS

Set in `.env`:

```
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Database

MySQL (XAMPP / local):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=playtime
DB_USERNAME=root
DB_PASSWORD=
```

Create the database once:

```sql
CREATE DATABASE playtime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run `php artisan migrate`.

## WhatsApp

See [../docs/WHATSAPP_EVOLUTION.md](../docs/WHATSAPP_EVOLUTION.md).

Evolution Docker — **must run from repo root** (not from `backend/`):

```bash
cd ..   # if you are in backend/
docker compose -f infra/docker-compose.evolution.yml up -d
```

Or double-click `evolution-up.bat` in the project root (Windows).

## Code layout

```
app/
  Http/Controllers/Api/ContactMessageController.php
  Services/EvolutionWhatsAppService.php
  Services/PhoneNormalizer.php
config/evolution.php
database/migrations/
```
