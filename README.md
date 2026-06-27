# SaaS Multi-Segmento

Uma unica plataforma multi-tenant onde o cliente escolhe o **segmento** do negocio
(barbearia, salao, clinica, oficina, etc.) e toda a experiencia se adapta: menus,
nomenclatura, campos e modulos ligados/desligados.

Nao sao varios sistemas: e **1 core + modulos reutilizaveis + templates de segmento**.

## Arquitetura

- **Modulos** (`/modules`): funcionalidades reutilizaveis (clientes, agenda, servicos, financeiro, equipe, estoque, OS, prontuario...). Construidas uma vez.
- **Segmentos** (`/segments`): cada nicho e um template que combina modulos + nomenclatura + campos + SEO. Adicionar um nicho = criar 1 arquivo.
- **Core**: auth multi-tenant, billing, UI compartilhada.

```
app/
  (marketing)/[segment]/   landing + SEO por nicho
  (auth)/login, signup     autenticacao + seletor de segmento
  (app)/                   area logada (dashboard, clientes, agenda, ...)
  api/auth/[...nextauth]/   rota do NextAuth
lib/        db, auth-context (multi-tenant), terms (nomenclatura), nav, plans, utils
modules/    registry de modulos + actions/forms de cada modulo
segments/   templates de segmento (barbearia, salao, clinica, oficina)
prisma/     schema.prisma + seed.ts
components/  UI compartilhada
```

### Multi-tenancy
Banco compartilhado com isolamento por `organizationId` (row-level). Toda Server Action
chama `getAuthContext()`, que le `userId`/`orgId` da **sessao** (nunca do cliente) e valida
o membership. Nunca confie em ids vindos do formulario.

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

## Deploy na Vercel
1. Faca push do repositorio para o GitHub.
2. Importe o projeto na Vercel.
3. Configure as variaveis: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`.
4. O `build` ja roda `prisma generate`. Rode as migrations no banco (`prisma migrate deploy`).

## Como adicionar um novo segmento
1. Crie `segments/<nicho>.ts` exportando um `SegmentTemplate` (modulos, termos, campos, SEO).
2. Registre em `segments/index.ts`.
3. Pronto: ele aparece no signup, ganha landing em `/<slug>` e o sistema se adapta.

## Como adicionar um novo modulo
1. Adicione a entrada em `modules/index.ts` (id, nav, descricao).
2. Crie a pasta `modules/<modulo>/` com `actions.ts` + componentes.
3. Crie a(s) pagina(s) em `app/(app)/<rota>/`.
4. Ligue o modulo nos segmentos que quiser.

## Roadmap (proximas fases)
- Cobranca real via Mercado Pago (checkout + webhook de assinatura)
- Link publico de agendamento
- Modulos avancados completos: Estoque, Ordem de Servico, Prontuario, WhatsApp, Orcamentos
- Mais segmentos: restaurante, academia, imobiliaria, petshop, etc.

## Seguranca
A senha do banco Neon foi exposta em chat durante o desenvolvimento. **Rotacione-a** no
painel do Neon e atualize o `.env` (que nao vai para o Git).
