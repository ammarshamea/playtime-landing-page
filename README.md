# PlayJaramanaa

منصة إدارة صالات الألعاب: تطبيق جوال، موقع تعريفي، API، ولوحة تراخيص.

## هيكل المشروع

```
PlayJaramanaa/
├── playtime/          # تطبيق Flutter (الجوال)
├── web/               # موقع Next.js (الصفحة التعريفية + ودجت التواصل)
├── backend/           # Laravel API (رسائل الزبائن + واتساب)
├── DashBoard/         # لوحة إصدار تراخيص (Vite + React)
├── infra/             # Docker — Evolution API + Postgres + Redis
├── EvolutionAPI/      # حزمة بايثون: QR + إرسال لأي رقم (run.py)
├── tools/             # أدوات تطوير قديمة (انظر EvolutionAPI/)
└── docs/              # توثيق مشترك
```

> **ملاحظة:** مجلد `landingpage/` قديم و**فارغ** (حُذفت النسخة المكررة). استخدم **`web/`** فقط لتشغيل الموقع.

## التشغيل السريع (تطوير)

| التطبيق | الأمر | الرابط |
|---------|--------|--------|
| API | `cd backend && php artisan serve --port=8001` | http://127.0.0.1:8001 |
| الموقع | `cd web && npm install && npm run dev` | http://localhost:3000 |
| Evolution | من **جذر المشروع**: `./evolution-up.bat` أو `docker compose -f infra/docker-compose.evolution.yml up -d` | http://localhost:8080/manager |
| الجوال | `cd playtime && flutter run` | — |
| لوحة التراخيص | `cd DashBoard && npm install && npm run dev` | حسب Vite |

## متغيرات البيئة المهمة

| الملف | المتغير |
|-------|---------|
| `web/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8001` |
| `backend/.env` | `EVOLUTION_*`, `CORS_ALLOWED_ORIGINS` |

تفاصيل: [docs/ENV.md](docs/ENV.md)

## رد آلي واتساب (بايثون)

```bash
cd EvolutionAPI
pip install -r requirements.txt
copy .env.example .env
python run.py
```

شرح كامل: [EvolutionAPI/README.md](EvolutionAPI/README.md)

## التوثيق

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — كيف تتصل التطبيقات
- [docs/WHATSAPP_EVOLUTION.md](docs/WHATSAPP_EVOLUTION.md) — ربط واتساب والإشعارات
- [backend/README.md](backend/README.md) — API
- [web/README.md](web/README.md) — الموقع
- [playtime/README.md](playtime/README.md) — التطبيق

## تدفق رسالة الزبون

```
زبون (web) → POST /api/contact-messages (backend) → قاعدة البيانات
                                              → Evolution API → واتساب رقم الشغل
```

رقم الإرسال: instance واتساب (مثلاً السعودي). رقم الاستلام: `EVOLUTION_NOTIFY_NUMBER` (مثلاً `963981175877`).
