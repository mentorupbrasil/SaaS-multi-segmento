import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { PageHeader } from "@/components/page-header";
import { getRestaurantTables } from "@/modules/restaurant/table-actions";
import { TableStatusSelect } from "@/modules/restaurant/table-status-select";
import { TableAddForm } from "@/modules/restaurant/table-add-form";

const STATUS_STYLES = {
  free: "border-green-200 bg-green-50",
  occupied: "border-red-200 bg-red-50",
  reserved: "border-amber-200 bg-amber-50",
};

export default async function MesasPage() {
  await getAuthContext();
  const tables = await getRestaurantTables();

  const zones = [...new Set(tables.map((t) => t.zone ?? "Salão"))];

  return (
    <div>
      <PageHeader
        title="Mapa de mesas"
        description="Visualize e atualize o status das mesas do salão."
        action={<TableAddForm />}
      />

      <div className="space-y-8">
        {zones.map((zone) => (
          <section key={zone}>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">{zone}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {tables
                .filter((t) => (t.zone ?? "Salão") === zone)
                .map((table) => (
                  <div
                    key={table.id}
                    className={`card border-2 p-4 ${STATUS_STYLES[table.status]}`}
                  >
                    <p className="font-semibold text-slate-900">{table.label}</p>
                    <p className="text-xs text-slate-500">{table.seats} lugares</p>
                    <Link
                      href={`/pdv?table=${encodeURIComponent(table.label)}`}
                      className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline"
                    >
                      Abrir no PDV
                    </Link>
                    <div className="mt-3">
                      <TableStatusSelect id={table.id} status={table.status} />
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
