# Deploy — GestorPro

Guia para publicar o GestorPro na Vercel com banco Neon PostgreSQL.

## Pré-requisitos

- Conta [Vercel](https://vercel.com) conectada ao repositório GitHub
- Projeto [Neon](https://neon.tech) com PostgreSQL
- Node.js 20+ localmente (para migrations/seed)

## 1. Banco Neon

1. Crie um projeto no Neon e copie as connection strings:
   - **Pooled** → `DATABASE_URL` (com `-pooler` no host, para a app)
   - **Direct** → `DIRECT_URL` (sem pooler, para migrations)
2. Aplique o schema:

```bash
npm run db:generate
npx prisma migrate deploy
# ou, em ambiente novo: npm run db:push
```

3. Popule dados demo (123 orgs + admin):

```bash
npm run db:seed
```

Contas após o seed:

| Conta | Senha | Uso |
|-------|-------|-----|
| `admin@gestorpro.com` | `admin123` | Super admin `/admin` |
| `demo@barbearia.com` | `123456` | Tenant demo barbearia |
| `demo-{segmentId}@gestorpro.com` | `demo123456` | Uma org por segmento |

## 2. Variáveis de ambiente (Vercel)

Configure em **Project → Settings → Environment Variables**:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Connection string pooled (Neon) |
| `DIRECT_URL` | Sim | Connection string direct (migrations) |
| `AUTH_SECRET` | Sim | `npx auth secret` |
| `AUTH_TRUST_HOST` | Sim | `true` na Vercel |
| `PLATFORM_ADMIN_EMAILS` | Sim | Ex.: `admin@gestorpro.com` |
| `NEXT_PUBLIC_APP_URL` | Recomendado | URL pública, ex. `https://app.gestorpro.com` |
| `SMTP_*` | Opcional | E-mail transacional (convites, reset) |
| `MERCADOPAGO_*` | Opcional | Billing real |
| `GOOGLE_CLIENT_ID` | Opcional | Login Google (habilita OAuth) |
| `GOOGLE_CLIENT_SECRET` | Opcional | Login Google |
| `SENTRY_DSN` | Opcional | Observabilidade |
| `FEATURE_IA` | Opcional | `true` para `/ia` |
| `FEATURE_PORTAL` | Opcional | `true` para portal do cliente |
| `FEATURE_PUBLIC_BOOKING` | Opcional | Agendamento público |

Veja `.env.example` para a lista completa.

## 3. Deploy na Vercel

1. Importe o repositório na Vercel (framework **Next.js** detectado automaticamente).
2. O `vercel.json` usa `npm ci` + `npm run build` (que já inclui `prisma generate`).
3. Após o primeiro deploy, rode migrations/seed **uma vez** contra o banco de produção (local ou CI):

```bash
DATABASE_URL="..." DIRECT_URL="..." npx prisma migrate deploy
DATABASE_URL="..." npm run db:seed
```

4. Valide: login demo, dashboard, `/admin`, build CI verde no GitHub Actions.

## 4. CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` roda em push/PR:

- `npm ci`
- `prisma generate`
- `npm run lint`
- `npm run test`
- `npm run build`

Mantenha o branch principal protegido exigindo CI verde.

## 5. OneDrive / Windows local

Se `prisma generate` falhar com **EPERM** (pasta no OneDrive):

- O `postinstall` usa `scripts/postinstall-safe.js` com retries automáticos.
- Alternativa: clone o repo fora do OneDrive ou use WSL.
- Manual: `npm run db:generate`

## 6. Segurança — rotacionar credenciais

> **Importante:** se a `DATABASE_URL` ou senhas SMTP/já foram expostas em chat, issue ou commit, **rotacione imediatamente**:

1. Neon → **Reset password** ou crie um novo role/database.
2. Atualize `DATABASE_URL` e `DIRECT_URL` na Vercel (Production + Preview).
3. Gere novo `AUTH_SECRET` (`npx auth secret`) e atualize na Vercel.
4. Revogue tokens Mercado Pago / Google OAuth se aplicável.
5. Redeploy para aplicar as novas variáveis.

Nunca commite `.env` com segredos reais.

## 7. RLS opcional (PostgreSQL)

Template em `prisma/rls.sql`. Aplique manualmente se quiser defesa em profundidade além do `organizationId` na aplicação:

```bash
psql "$DIRECT_URL" -f prisma/rls.sql
```

Use role separada para migrations (`BYPASSRLS`) vs. aplicação.

## 8. Sentry (opcional)

1. Instale: `npm i @sentry/nextjs`
2. Configure `SENTRY_DSN` na Vercel.
3. O hook `instrumentation.ts` inicializa via `lib/sentry.ts`.

## Checklist pós-deploy

- [ ] Migrations aplicadas (`migrate deploy`)
- [ ] Seed executado (orgs demo)
- [ ] Login admin e tenant demo OK
- [ ] CI verde no GitHub
- [ ] Credenciais antigas rotacionadas (se expostas)
- [ ] `NEXT_PUBLIC_APP_URL` apontando para domínio final
