import Link from "next/link";
import { Check, Minus, Star } from "lucide-react";
import { PLANS, COMPARISON } from "@/lib/plans";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-4 w-4 text-primary" aria-hidden />
        <span className="sr-only">Incluído</span>
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="mx-auto flex h-7 w-7 items-center justify-center">
        <Minus className="h-4 w-4 text-muted-foreground/35" aria-hidden />
        <span className="sr-only">Não incluído</span>
      </span>
    );
  }

  return <span className="text-sm font-semibold text-foreground">{value}</span>;
}

function planPriceLabel(priceMonthly: number | null): string {
  if (priceMonthly === null) return "Sob consulta";
  return formatCurrency(priceMonthly);
}

function stickyFeatureCell(className?: string) {
  return cn(
    "sticky left-0 z-10 border-r border-border bg-card px-4 sm:px-5",
    className,
  );
}

function highlightColumn(index: number, highlightIndex: number, extra?: string) {
  return cn(index === highlightIndex && "bg-primary/[0.06]", extra);
}

export function PricingComparison({
  highlightPlanId = "starter",
  className,
}: {
  highlightPlanId?: string;
  className?: string;
}) {
  const highlightIndex = PLANS.findIndex((p) => p.id === highlightPlanId);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-sm", className)}>
      <Table>
        <TableCaption className="sr-only">
          Comparação detalhada entre os planos Inicial, Profissional e Enterprise do GestorPro
        </TableCaption>

        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className={stickyFeatureCell("z-20 min-w-[200px] bg-muted/60 sm:min-w-[240px]")}>
              <span className="text-sm font-semibold text-foreground">Funcionalidade</span>
            </TableHead>
            {PLANS.map((plan, index) => (
              <TableHead
                key={plan.id}
                className={cn(
                  "min-w-[112px] px-3 text-center align-bottom sm:min-w-[136px]",
                  highlightColumn(index, highlightIndex),
                  plan.highlight && "border-x border-primary/15",
                )}
              >
                <div className="flex flex-col items-center gap-1.5 py-2">
                  {plan.highlight ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" aria-hidden />
                      {plan.badge ?? "Popular"}
                    </span>
                  ) : plan.badge ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {plan.badge}
                    </span>
                  ) : (
                    <span className="h-[18px]" aria-hidden />
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold tracking-tight",
                      plan.highlight ? "text-primary" : "text-foreground",
                    )}
                  >
                    {plan.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {planPriceLabel(plan.priceMonthly)}
                    {plan.priceMonthly !== null && " /mês"}
                  </span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {COMPARISON.map((group) => (
            <ComparisonGroup key={group.group} group={group} highlightIndex={highlightIndex} />
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="hover:bg-muted/50">
            <TableCell className={stickyFeatureCell("bg-muted/50 font-medium text-foreground")}>
              Escolher plano
            </TableCell>
            {PLANS.map((plan, index) => (
              <TableCell
                key={plan.id}
                className={cn("px-3 text-center", highlightColumn(index, highlightIndex))}
              >
                <Link
                  href={plan.priceMonthly === null ? "/suporte" : `/signup?plan=${plan.id}`}
                  className={cn(
                    buttonVariants({
                      variant: plan.highlight ? "default" : "outline",
                      size: "sm",
                    }),
                    "w-full max-w-[148px]",
                  )}
                >
                  {plan.priceMonthly === null ? "Falar com vendas" : "Assinar"}
                </Link>
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
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
      <TableRow className="border-b border-border bg-muted/20 hover:bg-muted/20">
        <TableCell
          colSpan={PLANS.length + 1}
          className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary sm:px-5"
        >
          {group.group}
        </TableCell>
      </TableRow>
      {group.rows.map((row) => (
        <TableRow key={row.label}>
          <TableCell className={stickyFeatureCell("text-sm text-muted-foreground")}>{row.label}</TableCell>
          {row.values.map((value, index) => (
            <TableCell
              key={`${row.label}-${index}`}
              className={cn("px-3 text-center", highlightColumn(index, highlightIndex))}
            >
              <CellValue value={value} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
