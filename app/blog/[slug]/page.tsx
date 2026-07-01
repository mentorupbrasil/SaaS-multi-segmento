import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPost } from "@/lib/blog";
import { Icon } from "@/components/icon";
import { formatDate } from "@/lib/utils";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <MarketingShell>
      <article className="section max-w-3xl py-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
          <Icon name="ArrowRight" className="h-4 w-4 rotate-180" />
          Voltar ao blog
        </Link>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {post.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readMinutes} min de leitura</span>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="mt-8 text-xl font-bold text-slate-900">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className="space-y-2">
                  {block.items?.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-slate-700">
                      <Icon name="Check" className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed text-slate-700">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white">
          <h3 className="text-xl font-bold">Coloque em prática com o GestorPro</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-100">
            Crie sua conta, escolha o segmento e organize o seu negócio hoje mesmo.
          </p>
          <Link href="/signup" className="btn-white mt-5">
            Criar minha conta
          </Link>
        </div>
      </article>
    </MarketingShell>
  );
}
