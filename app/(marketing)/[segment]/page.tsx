import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_SEGMENTS, getSegmentBySlug } from "@/segments";
import { MODULES } from "@/modules";
import { Icon } from "@/components/icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const seg = getSegmentBySlug(segment);
  if (!seg) return {};
  return {
    title: seg.seo.title,
    description: seg.seo.description,
    keywords: seg.seo.keywords,
    openGraph: {
      title: seg.seo.title,
      description: seg.seo.description,
    },
  };
}

export default async function SegmentLandingPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  const seg = getSegmentBySlug(segment);
  if (!seg) notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold text-brand-700">
          SaaS Multi-Segmento
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary">
            Comecar gratis
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
          <Icon name={seg.icon} className="h-8 w-8 text-brand-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {seg.seo.headline}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{seg.seo.subheadline}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            Testar gratis por 14 dias
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          Tudo que a sua {seg.label.toLowerCase()} precisa
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seg.modules.map((id) => {
            const mod = MODULES[id];
            if (!mod) return null;
            return (
              <div key={id} className="card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <Icon name={mod.nav[0]?.icon ?? "Tag"} className="h-5 w-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{mod.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{mod.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-brand-600 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold">Pronto para comecar?</h2>
          <p className="mt-3 text-brand-100">
            Crie a conta da sua {seg.label.toLowerCase()} em menos de 2 minutos.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Criar conta gratis
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-400">
        SaaS Multi-Segmento &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
