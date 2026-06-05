# GramScan

A minimal TON blockchain explorer built with Next.js App Router, TypeScript, Tailwind CSS, and server-side API proxy routes.

## Setup

Create `.env` from `.env.example`:

```bash
TONCENTER_API_KEY=
TONAPI_KEY=
```

Install and run:

```bash
npm install
npm run dev
```

## Notes

- API keys are only read by server routes.
- Live data uses TON Center and TonAPI.
- Account events prefer TonAPI and fall back to TON Center `getTransactions`.
- Caching is set per proxy route to stay rate-limit friendly.
- Top jettons, holder counts, token transfer history, and global latest transactions are marked as placeholders where the configured upstream APIs do not provide a reliable indexed endpoint.
