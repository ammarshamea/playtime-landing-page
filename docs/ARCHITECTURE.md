# Architecture

## Applications

| Folder | Role | Stack |
|--------|------|--------|
| `playtime/` | Venue sessions, reports, offline license | Flutter, Drift, Riverpod |
| `web/` | Marketing site, contact widget | Next.js 16, next-intl |
| `backend/` | Contact API, WhatsApp bridge | Laravel 13, SQLite |
| `DashBoard/` | License/token tooling (internal) | Vite, React, Ed25519 |
| `infra/` | Evolution API stack | Docker Compose |
| `tools/` | Dev helpers (not production) | Static HTML, scripts |

## Contact + WhatsApp

1. User submits phone + message on `web` (floating widget).
2. `backend` validates, rate-limits, stores `contact_messages`.
3. If `EVOLUTION_ENABLED`, `EvolutionWhatsAppService` calls Evolution `sendText` on instance `EVOLUTION_INSTANCE`.
4. Message delivered to `EVOLUTION_NOTIFY_NUMBER` (work phone, E.164 without `+`).

The connected WhatsApp account (QR on Evolution) is the **sender**. The notify number is the **recipient** — they must differ to avoid “message yourself”.

## Packages (Flutter)

- `playtime/packages/license_core` — activation, signatures
- `playtime/packages/session_engine` — session logic

## Ports (local)

| Service | Port |
|---------|------|
| Laravel API | 8001 |
| Next.js | 3000 |
| Evolution API | 8080 |
