import { Check, Minus } from "lucide-react";
import { PLANS, COMPARISON } from "@/lib/plans";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary" aria-label="Incluído" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="Não incluído" />;
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export function PricingComparison({ highlightPlanId = "pro", className }: { highlightPlanId?: string; className?: string }) {
  const highlightIndex = PLANS.findIndex((p) => p.id === highlightPlanId);

  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-sm", className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="min-w-[180px] px-5 font-semibold text-foreground">Funcionalidade</TableHead>
            {PLANS.map((plan) => (
              <TableHead
                key={plan.id}
                className={cn(
                  "min-w-[100px] px-3 text-center font-semibold",
                  plan.highlight ? "bg-primary/5 text-primary" : "text-foreground",
                )}
              >
                {plan.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {COMPARISON.map((group) => (
            <ComparisonGroup key={group.group} group={group} highlightIndex={highlightIndex} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ComparisonGroup({
  group,
  highlightIndex,
}: {
  group: (typeof COMPARISON)[number];
  highlightIndex: number;
}) {
  return (
    <>
      <TableRow className="border-b border-border bg-card hover:bg-card">
        <TableCell
          colSpan={PLANS.length + 1}
          className="px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-wider text-primary"
        >
          {group.group}
        </TableCell>
      </TableRow>
      {group.rows.map((row) => (
        <TableRow key={row.label}>
          <TableCell className="px-5 text-sm text-muted-foreground">{row.label}</TableCell>
          {row.values.map((value, i) => (
            <TableCell
              key={`${row.label}-${i}`}
              className={cn("px-3 text-center", i === highlightIndex && "bg-primary/5")}
            >
              <CellValue value={value} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
