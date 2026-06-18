# License dashboard (internal)

Vite + React tool for generating and verifying PlayJaramanaa license tokens (Ed25519).

## Run

```bash
cd DashBoard
npm install
npm run dev
```

## Docs

- [SECURITY_AUDIT.md](SECURITY_AUDIT.md) — security notes
- `LICENSE_KEYS.md` — local keys (gitignored)

## Legacy Python scripts

Optional CLI helpers (use only on a trusted machine):

- `main.py`
- `backup.py`

For production signing, prefer isolated tooling documented in [../playtime/README.md](../playtime/README.md).
