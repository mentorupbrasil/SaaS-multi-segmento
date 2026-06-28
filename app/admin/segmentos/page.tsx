import Link from "next/link";
import { getSegmentGroups } from "@/segments";
import { Icon } from "@/components/icon";

export default function AdminSegmentsPage() {
  const groups = getSegmentGroups();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Segmentos</h1>
        <p className="mt-1 text-sm text-slate-500">
          {groups.reduce((n, g) => n + g.segments.length, 0)} nichos em {groups.length} categorias — landings públicas
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">{group.label}</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.segments.map((seg) => (
                <Link
                  key={seg.id}
                  href={`/${seg.slug}`}
                  target="_blank"
                  className="card flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name={seg.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{seg.label}</p>
                    <p className="truncate text-xs text-slate-500">/{seg.slug}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
