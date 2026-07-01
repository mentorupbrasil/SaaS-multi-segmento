import Link from "next/link";
import { Icon } from "@/components/icon";

const PILLARS = [
  {
    icon: "Lock",
    title: "Ambiente isolado",
    text: "Cada negócio opera em organização própria. Seus dados não se misturam com outros clientes.",
  },
  {
    icon: "ShieldCheck",
    title: "Permissões por papel",
    text: "Dono, administrador e equipe — cada pessoa vê e faz só o que precisa.",
  },
  {
    icon: "Server",
    title: "Infraestrutura na nuvem",
    text: "Hospedagem moderna com alta disponibilidade. Acesse de qualquer lugar, sem instalar nada.",
  },
  {
    icon: "Fingerprint",
    title: "Acesso autenticado",
    text: "Login seguro com sessões protegidas. Somente a sua equipe entra no painel.",
  },
  {
    icon: "Globe",
    title: "Conexão criptografada",
    text: "Tráfego via HTTPS em produção, protegendo dados em trânsito entre você e a plataforma.",
  },
  {
    icon: "FileText",
    title: "Controle dos seus dados",
    text: "Informações dos clientes e do negócio ficam sob a sua gestão, com exportação quando precisar.",
  },
] as const;

const CHECKLIST = [
  "Multi-tenant com isolamento por organização",
  "Papéis OWNER, ADMIN e STAFF",
  "Dados em banco PostgreSQL gerenciado",
  "Uploads em storage dedicado",
  "Sem compartilhamento entre contas",
];

export function SecurityShowcase() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/60">
      <div className="section py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Painel de confiança */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200">
                  <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
                  Segurança
                </span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                  Seus dados protegidos, do jeito certo
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Pensado para PMEs que não podem arriscar perder histórico de clientes, financeiro ou
                  agenda. Segurança prática, sem complicação.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/privacidade"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-white"
                >
                  Política de privacidade
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Pilares */}
          <div className="lg:col-span-3">
            <div className="mb-6 lg:hidden">
              <span className="eyebrow">
                <Icon name="ShieldCheck" className="h-3.5 w-3.5" /> Segurança
              </span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Seus dados protegidos</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
