import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { formatCurrency } from "@/lib/utils";

export default async function TarifasPage() {
  const ctx = await getAuthContext();

  const [roomTypes, rooms] = await Promise.all([
    getMasterDataOptions(ctx.orgId, "ROOM_TYPE"),
    prisma.room.findMany({
      where: { organizationId: ctx.orgId },
      orderBy: { number: "asc" },
    }),
  ]);

  const ratesByType = new Map<string, { count: number; min: number; max: number; avg: number }>();

  for (const room of rooms) {
    const type = room.type ?? "Sem tipo";
    const current = ratesByType.get(type) ?? { count: 0, min: room.dailyRate, max: room.dailyRate, avg: 0 };
    current.count += 1;
    current.min = Math.min(current.min, room.dailyRate);
    current.max = Math.max(current.max, room.dailyRate);
    current.avg += room.dailyRate;
    ratesByType.set(type, current);
  }

  for (const [type, data] of ratesByType) {
    data.avg = data.count > 0 ? Math.round(data.avg / data.count) : 0;
    ratesByType.set(type, data);
  }

  return (
    <div>
      <PageHeader
        title="Tarifas e tipos"
        description="Visão de diárias por tipo de quarto e channel manager (em breve)."
      />

      <p className="mb-4 text-sm text-slate-500">
        <Link href="/quartos" className="text-brand-600 hover:underline">
          Gerenciar quartos →
        </Link>
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roomTypes.map((t) => {
          const stats = ratesByType.get(t.label);
          return (
            <div key={t.value} className="card p-5">
              <p className="text-sm font-semibold text-slate-900">{t.label}</p>
              {stats ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-brand-600">{formatCurrency(stats.avg)}</p>
                  <p className="text-xs text-slate-500">
                    {stats.count} quarto(s) · {formatCurrency(stats.min)} – {formatCurrency(stats.max)}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Nenhum quarto deste tipo</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="mb-2 font-semibold text-slate-900">Channel manager</h2>
        <p className="text-sm text-slate-600">
          Integração com Booking.com, Airbnb e Expedia disponível em{" "}
          <Link href="/conexoes" className="text-brand-600 hover:underline">
            Conexões
          </Link>
          . Configure credenciais e sincronize disponibilidade automaticamente.
        </p>
      </div>
    </div>
  );
}
