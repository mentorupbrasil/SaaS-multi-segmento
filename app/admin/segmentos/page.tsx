import { getSegmentGroups } from "@/segments";
import { Icon } from "@/components/icon";
import { EnterSegmentButton } from "@/components/enter-segment-button";
import Link from "next/link";

export default function AdminSegmentsPage() {
  const groups = getSegmentGroups();
  const total = groups.reduce((n, g) => n + g.segments.length, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Segmentos</h1>
        <p className="mt-1 text-sm text-slate-500">
          {total} sistemas configurados — use <strong>Ver no sistema</strong> para abrir o painel
          operacional (clientes, agenda, módulos) de cada nicho.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
        A landing pública (/barbearia, /clinica…) é só marketing. O sistema operacional abre aqui
        dentro, com o botão verde ou pelo seletor <strong>Sistema / segmento</strong> no menu.
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">{group.label}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.segments.map((seg) => (
                <div
                  key={seg.id}
                  className="card flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={seg.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{seg.label}</p>
                      <p className="truncate text-xs text-slate-500">/{seg.slug}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <EnterSegmentButton segmentId={seg.id} />
                    <Link
                      href={`/${seg.slug}`}
                      target="_blank"
                      className="btn-secondary text-sm"
                    >
                      Landing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
