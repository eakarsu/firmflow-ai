# FirmFlow governed legal operations

FirmFlow is a PostgreSQL-backed matter and document workflow. Its supported document journey is deterministic and evidence-based: scoped access, immutable versions, provenance hashes, independent legal review, authoritative templates, external provider contracts, retention/legal holds, export manifests, and a serial hash-chained audit log.

The former generic OpenRouter helpers are retired. Generated content may enter only as an `AI_DRAFT` version with model/version and prompt SHA-256 evidence. It is never eligible for signature, filing, or evidence export until a different authorized lawyer validates its jurisdiction, effective date, and authoritative source.

## Local setup

Requirements: Node.js 22.12+, Yarn 1, and PostgreSQL 16.

1. Copy `.env.example` to an ignored `.env` and generate an independent `NEXTAUTH_SECRET`.
2. Run `yarn install --frozen-lockfile`.
3. Apply the checked migration explicitly with `yarn migrate`. Migrations and demo data are never applied by startup.
4. Provision the first administrator only on an empty identity table: read a 16+ character password without echoing it, export it as `BOOTSTRAP_ADMIN_PASSWORD`, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_NAME`, run `yarn bootstrap`, then unset the password. Bootstrap refuses to run after any identity exists.
5. Run `yarn dev`. Production builds use `yarn build`; after deploying the migration, start with `NODE_ENV=production ./start.sh` and an HTTPS `NEXTAUTH_URL`.

`docker compose` is local-database convenience only. Set `POSTGRES_PASSWORD` before launching it; the port binds to loopback.

## Access and evidence model

Matter access is revocable and ordered: viewer, editor, counsel, owner. Privileged documents additionally require the access grant's privileged flag. Responsible counsel and administrators retain owner-equivalent matter control. APIs and server-rendered dashboards scope matters, clients, time, invoices, and documents to the active identity; identity deactivation or token-version change invalidates its short session.

Every document starts with version 1 and records a content hash, provenance type, source reference, author, jurisdiction, effective date, and optional authoritative-template or model/prompt evidence. Updates require the expected current version. Exact-term redaction makes a new version. Database triggers reject audit, version, review, and export mutation; the only permitted version mutation is governed payload deletion after hold release and retention expiry, while the hash and metadata remain.

Counsel review requires a different author/reviewer, matching jurisdiction and effective date, and explicit authoritative-source validation. Current-version approval gates e-signature, filing, and evidence export. Export refuses a broken audit chain and produces a hash-addressed JSON manifest rather than silently downloading mutable text.

## Provider contracts

OCR, e-signature, filing, storage, authoritative templates, and bounded legal drafting use configured HTTP adapters with runtime-only bearer secrets, idempotency keys, HTTPS enforcement in production, an eight-second timeout, response-shape validation, and durable success/failure evidence. Missing credentials return 503; upstream failures return 502. E-sign callbacks require a timestamped HMAC over the exact request body and are deduplicated by provider event ID.

Real provider credentials and calls are external acceptance gates. Before launch, validate data-processing and retention terms, object-version deletion, malware scanning, signer identity and ordering, court filing receipts/rejections, template ownership and effective dates, and provider disaster recovery. Obtain jurisdiction-specific counsel/privacy approval and complete accessibility, penetration, load, backup/restore, and incident-response exercises.

## Verification

`yarn test` runs 22 policy and real PostgreSQL workflow tests covering isolation, privileged access, version conflicts, AI and authoritative-template provenance, redaction, independent counsel review, jurisdiction/source validation, exports, provider failure/idempotency, signed and failed callbacks, access revocation, retention/legal hold, payload purge, immutable database triggers, concurrent audit serialization, and audit-chain verification.

CI installs from the lockfile, deploys the migration twice, checks Prisma drift, runs tests/typecheck/lint/build, audits dependencies, and scans full history for secrets.
