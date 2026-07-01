import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog";
import { Icon } from "@/components/icon";
import { formatDate } from "@/lib/utils";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dicas de gestão para o seu segmento: como organizar o financeiro, controlar clientes e escolher o melhor sistema para o seu negócio.",
};

export default function BlogPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Blog"
        title="Dicas para gerir melhor o seu negócio"
        description="Conteúdos práticos sobre gestão, organização e crescimento, por segmento."
      />

      <section className="section py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Icon name={post.cover} className="h-12 w-12 text-brand-500" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {post.category}
                </span>
                <h2 className="mt-2 font-semibold leading-snug text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readMinutes} min de leitura</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
