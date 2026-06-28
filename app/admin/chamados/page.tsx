import { Icon } from "@/components/icon";

export default function AdminTicketsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Chamados</h1>
        <p className="mt-1 text-sm text-slate-500">Central de suporte da plataforma</p>
      </div>

      <div className="card flex flex-col items-center px-8 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <Icon name="LifeBuoy" className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Em breve</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          O módulo de chamados permitirá abrir tickets por organização, acompanhar SLA, atribuir responsáveis e
          vincular conversas de WhatsApp e e-mail.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Enquanto isso, use{" "}
          <a href="/admin/organizacoes" className="font-medium text-brand-700 hover:underline">
            Organizações
          </a>{" "}
          para validar cada conta cadastrada.
        </p>
      </div>
    </div>
  );
}
