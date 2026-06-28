import Link from "next/link";
import { getFeaturedSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";

export function SocialProofStrip() {
  const featured = getFeaturedSegments();

  return (
    <section className="border-b border-slate-100 bg-slate-50/50">
      <div className="section py-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          Feito para negócios como o seu
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {featured.map((seg) => (
            <Link
              key={seg.id}
              href={`/${seg.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-brand-700"
            >
              <Icon
                name={seg.icon}
                className="h-4 w-4 text-slate-400 transition-colors group-hover:text-brand-600"
              />
              {seg.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
