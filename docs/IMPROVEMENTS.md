# Melhorias GestorPro — checklist (86 itens)

Status: ✅ concluído · 🔶 parcial · ❌ pendente

Atualizado após implementação das melhorias de engenharia, infra e backlog multi-agente.

---

## 1. Operacional / deploy

| # | Melhoria | Status |
|---|----------|--------|
| 1 | Push do fix `use-session-button.tsx` | ✅ |
| 2 | Rodar `npm run db:seed` no Neon | ✅ 132 orgs (131 segmentos + admin) |
| 3 | Prisma generate local (EPERM OneDrive) | ✅ `scripts/postinstall-safe.js` |
| 4 | Migrations versionadas | ✅ `prisma/migrations/` |
| 5 | Rotacionar credencial Neon exposta | 🔶 Documentado em `docs/DEPLOY.md` |

---

## 2. Segurança e permissões

| # | Melhoria | Status |
|---|----------|--------|
| 6 | Middleware completo (rotas protegidas) | ✅ `lib/app-routes.ts` + `auth.config.ts` |
| 7 | `requireModule()` wired nas páginas | ✅ `app/(app)/template.tsx` |
| 8 | Middleware valida platform admin em `/admin` | ✅ |
| 9 | Permissões por papel (OWNER/ADMIN) | 🔶 `requireMutationRole` nos módulos principais |
| 10 | Recuperação de senha | ✅ `/forgot-password` |
| 11 | Verificação de e-mail | ✅ `password-actions.ts` |
| 12 | RLS no PostgreSQL | 🔶 Template `prisma/rls.sql` |
| 13 | Adapter Prisma no NextAuth | ❌ JWT-only (OAuth stub sem link de conta) |

---

## 3. Multi-segmento (123 nichos)

| # | Melhoria | Status |
|---|----------|--------|
| 14 | 11 segmentos sem `customerFields` | ✅ |
| 15 | Educação expandida (8+ segmentos) | ✅ `segments/educacao.ts` |
| 16 | Especialidades por sub-segmento | 🔶 Tipo + copy; sem runtime config |
| 17 | Admin sidebar acompanha segmento | 🔶 `buildSuperAdminNav(segmentId?)` |
| 18 | Segment switcher com busca | ✅ |
| 19 | Segmentos só em código | ❌ Sem CRUD admin |
| 20 | Comentário “114 segmentos” | ✅ Atualizado (131 segmentos) |

---

## 4. Consistência marketing vs sistema

| # | Melhoria | Status |
|---|----------|--------|
| 21 | `lib/features.ts` desatualizado | 🔶 Revisado parcialmente |
| 22 | README roadmap obsoleto | 🔶 |
| 23 | Landings oversell capabilities | ✅ Aviso de plano + FAQ por segmento |
| 24 | Planos prometem WhatsApp/link público | ✅ Enforcement + `FEATURE_WHATSAPP` / booking |
| 25 | Homepage IA mock | 🔶 Gated por `FEATURE_IA` |
| 26 | `/funcionalidades` mistura available/soon | 🔶 |

---

## 5. Funcionalidades core (CRUD e fluxos)

| # | Melhoria | Status |
|---|----------|--------|
| 27 | Exclusão de registros | ✅ Delete actions nos módulos |
| 28 | Edição limitada | 🔶 Update em módulos principais |
| 29 | Configurações editáveis | ✅ `configuracoes/settings-form.tsx` |
| 30 | UI para `organization.config.terms` | ✅ |
| 31 | Prontuário: upload de arquivo | ❌ Só URL |
| 32 | Página de relatórios | ❌ |
| 33 | Link público de agendamento | ✅ `/agendar/[slug]` |
| 34 | Confirmação/lembrete automático | 🔶 `lib/automations.ts` + SMTP scaffold |
| 35 | Agenda: recorrência, lista de espera | ❌ |
| 36 | `UseSessionButton` com `router.refresh()` | ✅ |
| 37 | FinancialEntry com relações Prisma | ✅ Schema + migration |
| 38 | Assinatura inativa bloqueia | ✅ `requireActiveSubscription` + middleware |
| 39 | Planos com enforcement | ✅ Menu, rotas, export, usuários, filiais |
| 40 | Multi-unidade/filiais | 🔶 Model `Branch`; UI parcial |
| 41 | Comissões automáticas | ❌ |
| 42 | Pacotes/combos/assinaturas recorrentes | 🔶 Pacotes de sessão |
| 43 | Orçamento → OS/PDV refinado | 🔶 |
| 44 | Reserva → financeiro propagado | 🔶 Check-out cria lançamento |

---

## 6. Billing e monetização

| # | Melhoria | Status |
|---|----------|--------|
| 45 | Billing real (MP/Stripe) | 🔶 Scaffold Mercado Pago |
| 46 | Webhooks de pagamento | 🔶 |
| 47 | Admin faturamento completo | 🔶 |
| 48 | Trial real | 🔶 Enum existe; signup ativa ACTIVE |
| 49 | Limites por plano no invite | ✅ `canAddUser` |

---

## 7. Premium / roadmap

| # | Melhoria | Status |
|---|----------|--------|
| 50 | Inteligência artificial | 🔶 `/ia` + `api/ai/summary` |
| 51 | Portal do cliente | 🔶 `/portal/[orgSlug]` |
| 52 | App mobile | ❌ Web responsiva |
| 53 | Integrações reais | 🔶 `/integracoes` + toggles |
| 54 | Automações | 🔶 `lib/automations.ts` |
| 55 | Feature flags dinâmicos | 🔶 `lib/feature-flags.ts` |
| 56 | Chamados/suporte | 🔶 `/admin/chamados` |
| 57 | OAuth / login social | 🔶 Google stub (`lib/oauth-providers.ts`) |
| 58 | API pública / webhooks | ❌ |

---

## 8. UX / UI do sistema logado

| # | Melhoria | Status |
|---|----------|--------|
| 59 | Signup com 123 segmentos | 🔶 Busca no signup |
| 60 | Preview segmento confuso | 🔶 Banner preview |
| 61 | Onboarding pós-signup | ✅ `/onboarding` |
| 62 | Empty states padronizados | 🔶 |
| 63 | Paginação/busca global | ❌ |
| 64 | Máscaras de telefone | ❌ |
| 65 | Componente `coming-soon.tsx` usado | 🔶 |

---

## 9. Site marketing (público)

| # | Melhoria | Status |
|---|----------|--------|
| 66 | 123 landings estáticas | ✅ |
| 67 | `/precos` billing simulado | 🔶 |
| 68 | `/integracoes` em breve | 🔶 |
| 69 | `/demonstracao`, `/casos`, `/blog` | 🔶 Conteúdo estático |
| 70 | SEO por segmento | 🔶 Templates; validar escala |
| 71 | Analytics/tracking | 🔶 `NEXT_PUBLIC_GA_ID` no `.env.example` |

---

## 10. Admin (super admin)

| # | Melhoria | Status |
|---|----------|--------|
| 72 | Impersonação org + segmento | ✅ |
| 73 | Gestão de segmentos (CRUD) | ❌ Listagem only |
| 74 | Audit log | 🔶 `lib/audit-log.ts` + model |
| 75 | Métricas por segmento | ❌ |
| 76 | Demo orgs com dados ricos | 🔶 Seed básico |

---

## 11. Qualidade de engenharia

| # | Melhoria | Status |
|---|----------|--------|
| 77 | Testes automatizados | ✅ Vitest + 4 suites em `lib/*.test.ts` |
| 78 | CI/CD | ✅ `.github/workflows/ci.yml` |
| 79 | Lint/typecheck no pipeline | ✅ `npm run lint` no CI |
| 80 | Server Actions padronizadas | 🔶 `FormResult` parcial |
| 81 | Rate limiting | ✅ `lib/rate-limit.ts` |
| 82 | Observabilidade | ✅ `instrumentation.ts` + `lib/sentry.ts` |

---

## 12. Schema / dados

| # | Melhoria | Status |
|---|----------|--------|
| 83 | `segmentId` string livre | ❌ Sem FK |
| 84 | Sub-rotas sem ModuleId próprio | ✅ Documentado em `require-module.ts` |
| 85 | Estoque: alerta no dashboard | 🔶 Contagem estoque baixo |
| 86 | Histórico/auditoria por entidade | 🔶 `updatedAt` + `AuditLog` |

---

## Resumo

| Status | Qtd |
|--------|-----|
| ✅ Concluído | 28 |
| 🔶 Parcial | 44 |
| ❌ Pendente | 14 |

## Comandos úteis

```bash
npm install          # instala + postinstall-safe (prisma generate)
npm run test         # vitest run
npm run test:watch   # vitest watch
npm run lint
npm run build
```

Ver também: [DEPLOY.md](./DEPLOY.md)
