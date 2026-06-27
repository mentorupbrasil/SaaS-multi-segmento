import { Calendar, Users, Wallet, TrendingUp } from "lucide-react";

// Mockup visual do painel (puro CSS, sem imagem) para dar credibilidade ao hero.
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-200/40 via-violet-200/40 to-fuchsia-200/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-xs font-medium text-slate-400">Painel</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Clientes</span>
                <Users className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">248</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Hoje</span>
                <Calendar className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-1 text-xl font-bold text-slate-900">12</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Receita do mês</span>
              <Wallet className="h-4 w-4 text-brand-600" />
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900">R$ 18.430</p>
            <div className="mt-3 flex items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-brand-200 to-brand-500"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
            <TrendingUp className="h-4 w-4" />
            +24% em relação ao mês passado
          </div>
        </div>
      </div>
    </div>
  );
}
