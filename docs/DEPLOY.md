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

3. Popule dados demo **apenas em ambiente de desenvolvimento/staging** (não rode seed em produção com clientes reais):

```bash
npm run db:seed
```

> **Produção:** evite `db:seed` — cria contas demo com senhas fracas. Use apenas migrations.

Contas após o seed (dev/staging):

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
| `NEXT_PUBLIC_APP_URL` | Sim (vendas) | URL pública, ex. `https://www.gestorpro.sbs` |
| `ASAAS_API_KEY` | Sim (vendas) | Chave API Asaas (`$aact_prod_...` em produção) |
| `ASAAS_ENV` | Opcional | `production` — detectado automaticamente se a chave contém `_prod_` |
| `ASAAS_WEBHOOK_TOKEN` | Recomendado | Token do header `asaas-access-token` no webhook |
| `SMTP_*` / `RESEND_API_KEY` | Recomendado | E-mail transacional; use `SMTP_FROM="GestorPro <noreply@gestorpro.sbs>"` |
| `FEATURE_WHATSAPP` | Recomendado | `true` para lembretes WhatsApp (plano Pro+) |
| `FEATURE_PUBLIC_BOOKING` | Recomendado | `true` para link público de agendamento |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcional | Dígitos com DDI (ex. `5511999999999`) para /suporte |
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

## 4. Asaas — receber pagamentos (produção)

1. Conta em [asaas.com](https://www.asaas.com) → **Integrações → Chave de API** (produção, `$aact_prod_...`).
2. **Não marque** permissão de saque na chave — só cobrança.
3. Na **Vercel**, configure:

```
ASAAS_API_KEY=sua_chave_prod
ASAAS_ENV=production
NEXT_PUBLIC_APP_URL=https://www.gestorpro.sbs
ASAAS_WEBHOOK_TOKEN=token_longo_que_voce_inventa
```

4. **Integrações → Webhooks** no Asaas:
   - URL: `https://www.gestorpro.sbs/api/billing/webhook`
   - Token de autenticação: mesmo valor de `ASAAS_WEBHOOK_TOKEN`
   - Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `SUBSCRIPTION_DELETED`

5. Rode a migration Asaas no banco de produção:

```bash
npx prisma migrate deploy
```

6. Teste: cadastro em `/signup` → `/assinatura` → pagamento → webhook libera acesso.

> Se a chave API foi exposta, **revogue e gere outra** no painel Asaas.

## 5. CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` roda em push/PR:

- `npm ci`
- `prisma generate`
- `npm run lint`
- `npm run test`
- `npm run build`

Mantenha o branch principal protegido exigindo CI verde.

## 6. OneDrive / Windows local

Se `prisma generate` falhar com **EPERM** (pasta no OneDrive):

- O `postinstall` usa `scripts/postinstall-safe.js` com retries automáticos.
- Alternativa: clone o repo fora do OneDrive ou use WSL.
- Manual: `npm run db:generate`

## 7. Segurança — rotacionar credenciais

> **Importante:** se a `DATABASE_URL` ou senhas SMTP/já foram expostas em chat, issue ou commit, **rotacione imediatamente**:

1. Neon → **Reset password** ou crie um novo role/database.
2. Atualize `DATABASE_URL` e `DIRECT_URL` na Vercel (Production + Preview).
3. Gere novo `AUTH_SECRET` (`npx auth secret`) e atualize na Vercel.
4. Revogue tokens Asaas / Google OAuth se aplicável.
5. Redeploy para aplicar as novas variáveis.

Nunca commite `.env` com segredos reais.

## 8. RLS opcional (PostgreSQL)

Template em `prisma/rls.sql`. Aplique manualmente se quiser defesa em profundidade além do `organizationId` na aplicação:

```bash
psql "$DIRECT_URL" -f prisma/rls.sql
```

Use role separada para migrations (`BYPASSRLS`) vs. aplicação.

## 9. Sentry (opcional)

1. Instale: `npm i @sentry/nextjs`
2. Configure `SENTRY_DSN` na Vercel.
3. O hook `instrumentation.ts` inicializa via `lib/sentry.ts`.

## Checklist pós-deploy

- [ ] `ASAAS_API_KEY` + `NEXT_PUBLIC_APP_URL` na Vercel
- [ ] `FEATURE_WHATSAPP=true` e `FEATURE_PUBLIC_BOOKING=true` (se vender Pro)
- [ ] `RESEND_API_KEY` ou `SMTP_*` + `SMTP_FROM` para e-mails transacionais
- [ ] Webhook Asaas apontando para `/api/billing/webhook` (fila ativa)
- [ ] Migration Asaas aplicada (`migrate deploy`)
- [ ] **Não** rodar `db:seed` em produção com clientes reais
- [ ] Login e fluxo signup → pagamento → painel OK
- [ ] Contato público: `contato@gestorpro.sbs` (e `NEXT_PUBLIC_WHATSAPP_NUMBER` se tiver WhatsApp)
- [ ] CI verde no GitHub
- [ ] Credenciais antigas rotacionadas (se expostas)
- [ ] `NEXT_PUBLIC_APP_URL` apontando para domínio final
