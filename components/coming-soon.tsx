import { Icon } from "@/components/icon";

export function ComingSoon({
  title,
  description,
  icon = "Package",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <div className="card mt-6 flex flex-col items-center gap-3 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-100">
          <Icon name={icon} className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Módulo em breve</h2>
        <p className="max-w-md text-sm text-slate-500">{description}</p>
        <span className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Disponível nas próximas fases
        </span>
      </div>
    </div>
  );
}
