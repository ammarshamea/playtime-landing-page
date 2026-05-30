# Web (Next.js)

Marketing / landing site for PlayJaramanaa with Arabic/English i18n and in-site contact widget.

## Setup

```bash
cd web
npm install
cp .env.local.example .env.local   # if missing, create with NEXT_PUBLIC_API_URL
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## Run

```bash
npm run dev
```

http://localhost:3000

## Structure

```
src/app/[locale]/     # Pages (ar / en)
src/components/       # UI + contact widget
messages/             # i18n JSON
docs/                 # Product notes (e.g. V2-ROADMAP)
```

API must be running: see [../backend/README.md](../backend/README.md).
