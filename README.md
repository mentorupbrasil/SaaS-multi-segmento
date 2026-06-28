# SaaS Multi-Segmento

Uma unica plataforma multi-tenant onde o cliente escolhe o **segmento** do negocio
(barbearia, salao, clinica, oficina, etc.) e toda a experiencia se adapta: menus,
nomenclatura, campos e modulos ligados/desligados.

Nao sao varios sistemas: e **1 core + modulos reutilizaveis + templates de segmento**.

## Arquitetura

- **Modulos** (`/modules`): funcionalidades reutilizaveis (clientes, agenda, servicos, financeiro, equipe, estoque, PDV, OS, comissoes, pacotes, prontuario...). Construidas uma vez.
- **Segmentos** (`/segments`): cada nicho e um template que combina modulos + nomenclatura + campos + SEO. Adicionar um nicho = criar 1 arquivo.
- **Core**: auth multi-tenant, billing (Mercado Pago scaffold), portal publico, IA (scaffold), integracoes (scaffold), UI compartilhada.

```
app/
  (marketing)/[segment]/   landing + SEO por nicho
  (auth)/login, signup     autenticacao + seletor de segmento
  (app)/                   area logada (dashboard, clientes, agenda, ...)
  portal/[orgSlug]/        portal publico do cliente (plan-gated)
  agendar/[slug]/          link publico de agendamento (plan Pro+)
  api/billing/webhook/     webhook Mercado Pago (stub)
  api/auth/[...nextauth]/  rota do NextAuth
lib/        db, auth-context, terms, nav, plans, plan-limits, features, integrations
modules/    registry de modulos + actions/forms de cada modulo
segments/   templates de segmento (131 nichos)
prisma/     schema.prisma + seed.ts
components/  UI compartilhada
```

### Multi-tenancy
Banco compartilhado com isolamento por `organizationId` (row-level). Toda Server Action
chama `getAuthContext()`, que le `userId`/`orgId` da **sessao** (nunca do cliente) e valida
o membership. Nunca confie em ids vindos do formulario.

Limites de plano (usuarios, filiais, modulos extras, features) sao aplicados via
`lib/plan-limits.ts`.

## Stack
Next.js (App Router) + TypeScript, Prisma + PostgreSQL (Neon), NextAuth/Auth.js v5
(credentials), Tailwind CSS. Deploy: Vercel.

## Como rodar localmente

> Pre-requisitos: Node 18+ e a `DATABASE_URL` no arquivo `.env` (ja incluso; veja `.env.example`).

```bash
npm install            # instala dependencias (roda prisma generate via postinstall)
npm run db:push        # cria as tabelas no banco (ou: npm run db:migrate)
npm run db:seed        # opcional: cria a conta demo
npm run dev            # inicia em http://localhost:3000
```

Conta demo (apos `db:seed`): **demo@barbearia.com** / senha **123456**

### Scripts uteis
- `npm run db:migrate` - cria/aplica migrations versionadas
- `npm run db:push` - sincroniza o schema sem migration (bom para prototipar)
- `npm run db:studio` - abre o Prisma Studio
- `npm run build` / `npm start` - build de producao

## Variaveis de ambiente

Veja `.env.example`. Em producao gere um segredo real:

```bash
npx auth secret
```

### Obrigatorias (core)
- `DATABASE_URL`, `DIRECT_URL` — PostgreSQL (Neon)
- `AUTH_SECRET`, `AUTH_TRUST_HOST` — NextAuth
- `NEXT_PUBLIC_APP_URL` — URL publica da aplicacao (checkout e webhooks)

### Feature flags
- `FEATURE_IA` — habilita modulo de IA (`/ia`, resumos e insights)
- `FEATURE_PORTAL` — habilita portal publico do cliente
- `FEATURE_PUBLIC_BOOKING` — link publico de agendamento
- `FEATURE_WHATSAPP` — lembretes e integracao WhatsApp

### Billing (Mercado Pago)
- `MERCADOPAGO_ACCESS_TOKEN` — checkout real; sem token, assinatura simulada
- `MERCADOPAGO_PUBLIC_KEY` — chave publica (frontend, se necessario)
- `MERCADOPAGO_WEBHOOK_SECRET` — validacao de assinatura do webhook

### Observabilidade
- `SENTRY_DSN` — erros em producao (stub em `lib/sentry.ts`; instale `@sentry/nextjs` para ativar)
- `NEXT_PUBLIC_GA_ID` — Google Analytics no site marketing

### E-mail (SMTP)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`

## Deploy na Vercel
1. Faca push do repositorio para o GitHub.
2. Importe o projeto na Vercel.
3. Configure as variaveis: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` e demais conforme `.env.example`.
4. O `build` ja roda `prisma generate`. Rode as migrations no banco (`prisma migrate deploy`).
5. Configure o webhook do Mercado Pago apontando para `https://seu-dominio.com/api/billing/webhook`.

## Como adicionar um novo segmento
1. Crie `segments/<nicho>.ts` exportando um `SegmentTemplate` (modulos, termos, campos, SEO).
2. Registre em `segments/index.ts`.
3. Pronto: ele aparece no signup, ganha landing em `/<slug>` e o sistema se adapta.

## Como adicionar um novo modulo
1. Adicione a entrada em `modules/index.ts` (id, nav, descricao).
2. Crie a pasta `modules/<modulo>/` com `actions.ts` + componentes.
3. Crie a(s) pagina(s) em `app/(app)/<rota>/`.
4. Ligue o modulo nos segmentos que quiser.

## Roadmap

### Implementado
- **131 segmentos** com landing SEO, signup e demo por nicho
- Modulos core: clientes, agenda, servicos, financeiro, caixa, equipe, relatorios
- Modulos avancados: estoque, PDV, ordens de servico, orcamentos, comissoes, pacotes, prontuario
- Link publico de agendamento (`/agendar/[slug]`, plan Pro+)
- Portal do cliente (scaffold em `/portal/[orgSlug]`, flag `FEATURE_PORTAL`)
- IA — resumos e insights (scaffold em `/ia`, flag `FEATURE_IA`)
- Integracoes — WhatsApp, PIX, Google Agenda (scaffold em `/integracoes`, plan-gated)
- Billing — checkout Mercado Pago + webhook stub (`/api/billing/webhook`)
- Limites de plano aplicados (`lib/plan-limits.ts`)

### Proximas fases
- Checkout recorrente (assinatura mensal) completo no Mercado Pago
- Validacao de webhook com `MERCADOPAGO_WEBHOOK_SECRET`
- Integracoes reais (WhatsApp Business API, PIX conciliado, Google Calendar OAuth)
- App mobile dedicado
- NFS-e / emissao fiscal

## Seguranca
A senha do banco Neon foi exposta em chat durante o desenvolvimento. **Rotacione-a** no
painel do Neon e atualize o `.env` (que nao vai para o Git).
